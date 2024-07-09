import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Channel, ChannelsStatus, GetInfo, LightningBalance, OnChainBalance, Peer } from '../../../../../shared/models/eclModels';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS, getPaginatorLabel, ScreenSizeEnum, FEE_RATE_TYPES, AlertTypeEnum, APICallStatusEnum, SortOrderEnum, ECL_DEFAULT_PAGE_SETTINGS, ECL_PAGE_DEFS, DataTypeEnum } from '../../../../../shared/services/consts-enums-functions';
import { LoggerService } from '../../../../../shared/services/logger.service';
import { CommonService } from '../../../../../shared/services/common.service';

import { ECLChannelInformationComponent } from '../../channel-information-modal/channel-information.component';
import { RTLEffects } from '../../../../../store/rtl.effects';
import { ApiCallStatusPayload } from '../../../../../shared/models/apiCallsPayload';
import { openAlert, openConfirmation } from '../../../../../store/rtl.actions';
import { RTLState } from '../../../../../store/rtl.state';
import { closeChannel, updateChannel } from '../../../../store/ecl.actions';
import { allChannelsInfo, eclNodeInformation, eclPageSettings, onchainBalance, peers } from '../../../../store/ecl.selector';
import { ColumnDefinition, PageSettings, TableSetting } from '../../../../../shared/models/pageSettings';
import { CamelCaseWithSpacesPipe } from '../../../../../shared/pipes/app.pipe';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { ECLChannelRebalanceComponent } from '../../channel-rebalance-modal/channel-rebalance.component';

@Component({
  selector: 'rtl-ecl-channel-open-table',
  templateUrl: './channel-open-table.component.html',
  styleUrls: ['./channel-open-table.component.scss'],
  providers: [
    { provide: MAT_SELECT_CONFIG, useValue: { overlayPanelClass: 'rtl-select-overlay' } },
    { provide: MatPaginatorIntl, useValue: getPaginatorLabel('Channels') }
  ]
})
export class ECLChannelOpenTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;
  public nodePageDefs = ECL_PAGE_DEFS;
  public selFilterBy = 'all';
  public colWidth = '20rem';
  public PAGE_ID = 'peers_channels';
  public tableSetting: TableSetting = { tableId: 'open_channels', recordsPerPage: PAGE_SIZE, sortBy: 'alias', sortOrder: SortOrderEnum.DESCENDING };
  public activeChannels: Channel[];
  public totalBalance = 0;
  public displayedColumns: any[] = [];
  public channels: any = new MatTableDataSource([]);
  public myChanPolicy: any = {};
  public information: GetInfo = {};
  public numPeers = -1;
  public feeRateTypes = FEE_RATE_TYPES;
  public selFilter = '';
  public pageSize = PAGE_SIZE;
  public pageSizeOptions = PAGE_SIZE_OPTIONS;
  public screenSize = '';
  public screenSizeEnum = ScreenSizeEnum;
  public errorMessage = '';
  public apiCallStatus: ApiCallStatusPayload | null = null;
  public apiCallStatusEnum = APICallStatusEnum;
  private unSubs: Array<Subject<void>> = [new Subject(), new Subject(), new Subject(), new Subject(), new Subject(), new Subject(), new Subject(), new Subject(), new Subject()];

  constructor(private logger: LoggerService, private store: Store<RTLState>, private rtlEffects: RTLEffects, private commonService: CommonService, private router: Router, private camelCaseWithSpaces: CamelCaseWithSpacesPipe) {
    this.screenSize = this.commonService.getScreenSize();
  }

  ngOnInit() {
    if (window.history.state && (window.history.state.filterColumn || window.history.state.filterValue)) {
      this.selFilterBy = window.history.state.filterColumn || 'all';
      this.selFilter = window.history.state.filterValue || '';
    }
    this.store.select(eclPageSettings).pipe(takeUntil(this.unSubs[0])).
      subscribe((settings: { pageSettings: PageSettings[], apiCallStatus: ApiCallStatusPayload }) => {
        this.errorMessage = '';
        this.apiCallStatus = settings.apiCallStatus;
        if (this.apiCallStatus.status === APICallStatusEnum.ERROR) {
          this.errorMessage = this.apiCallStatus.message || '';
        }
        this.tableSetting = settings.pageSettings.find((page) => page.pageId === this.PAGE_ID)?.tables.find((table) => table.tableId === this.tableSetting.tableId) || ECL_DEFAULT_PAGE_SETTINGS.find((page) => page.pageId === this.PAGE_ID)?.tables.find((table) => table.tableId === this.tableSetting.tableId)!;
        if (this.screenSize === ScreenSizeEnum.XS || this.screenSize === ScreenSizeEnum.SM) {
          this.displayedColumns = JSON.parse(JSON.stringify(this.tableSetting.columnSelectionSM));
        } else {
          this.displayedColumns = JSON.parse(JSON.stringify(this.tableSetting.columnSelection));
        }
        this.displayedColumns.unshift('announceChannel');
        this.displayedColumns.push('actions');
        this.pageSize = this.tableSetting.recordsPerPage ? +this.tableSetting.recordsPerPage : PAGE_SIZE;
        this.colWidth = this.displayedColumns.length ? ((this.commonService.getContainerSize().width / this.displayedColumns.length) / 14) + 'rem' : '20rem';
        this.logger.info(this.displayedColumns);
      });
    this.store.select(allChannelsInfo).pipe(takeUntil(this.unSubs[1])).
      subscribe((allChannelsSelector: ({ activeChannels: Channel[], pendingChannels: Channel[], inactiveChannels: Channel[], lightningBalance: LightningBalance, channelsStatus: ChannelsStatus, apiCallStatus: ApiCallStatusPayload })) => {
        this.errorMessage = '';
        this.apiCallStatus = allChannelsSelector.apiCallStatus;
        if (this.apiCallStatus.status === APICallStatusEnum.ERROR) {
          this.errorMessage = !this.apiCallStatus.message ? '' : (typeof (this.apiCallStatus.message) === 'object') ? JSON.stringify(this.apiCallStatus.message) : this.apiCallStatus.message;
        }
        this.activeChannels = allChannelsSelector.activeChannels;
        if (this.activeChannels && this.sort && this.paginator && this.displayedColumns.length > 0) {
          this.loadChannelsTable();
        }
        this.logger.info(allChannelsSelector);
      });
    this.store.select(eclNodeInformation).pipe(takeUntil(this.unSubs[2])).
      subscribe((nodeInfo: any) => {
        this.information = nodeInfo;
      });
    this.store.select(peers).pipe(takeUntil(this.unSubs[3])).
      subscribe((peersSelector: { peers: Peer[], apiCallStatus: ApiCallStatusPayload }) => {
        this.numPeers = (peersSelector.peers && peersSelector.peers.length) ? peersSelector.peers.length : 0;
      });
    this.store.select(onchainBalance).pipe(takeUntil(this.unSubs[4])).
      subscribe((ocBalSelector: { onchainBalance: OnChainBalance, apiCallStatus: ApiCallStatusPayload }) => {
        this.totalBalance = ocBalSelector.onchainBalance.total || 0;
      });
  }

  ngAfterViewInit() {
    if (this.activeChannels && this.sort && this.paginator && this.displayedColumns.length > 0) {
      this.loadChannelsTable();
    }
  }

  onCircularRebalance(selChannel: any) {
    const channelsToRebalanceMessage = {
      channels: this.activeChannels,
      selChannel: selChannel,
      information: this.information
    };
    this.store.dispatch(openAlert({
      payload: {
        data: {
          message: channelsToRebalanceMessage,
          component: ECLChannelRebalanceComponent
        }
      }
    }));
  }

  onChannelUpdate(channelToUpdate: Channel | string) {
    if (channelToUpdate !== 'all' && ((<Channel>channelToUpdate)?.state && (<Channel>channelToUpdate)?.state !== 'NORMAL')) {
      return;
    }
    const titleMsg = typeof channelToUpdate === 'string' && channelToUpdate === 'all' ? 'Update fee policy for all channels' :
      ('Update fee policy for Channel: ' + ((!(<Channel>channelToUpdate)?.alias && !(<Channel>channelToUpdate)?.shortChannelId) ? (<Channel>channelToUpdate)?.channelId :
        ((<Channel>channelToUpdate)?.alias && (<Channel>channelToUpdate)?.shortChannelId) ? (<Channel>channelToUpdate)?.alias + ' (' + (<Channel>channelToUpdate)?.shortChannelId + ')' :
          (<Channel>channelToUpdate)?.alias ? (<Channel>channelToUpdate)?.alias : (<Channel>channelToUpdate)?.shortChannelId));
    const confirmationMsg = [];
    this.store.dispatch(openConfirmation({
      payload: {
        data: {
          type: AlertTypeEnum.CONFIRM,
          alertTitle: 'Update Fee Policy',
          noBtnText: 'Cancel',
          yesBtnText: 'Update',
          message: confirmationMsg,
          titleMessage: titleMsg,
          flgShowInput: true,
          getInputs: [
            { placeholder: 'Base Fee (mSats)', inputType: DataTypeEnum.NUMBER, inputValue: channelToUpdate && typeof (<Channel>channelToUpdate)?.feeBaseMsat !== 'undefined' ? (<Channel>channelToUpdate)?.feeBaseMsat : 1000, step: 100, width: 48 },
            { placeholder: 'Fee Rate (mili mSats)', inputType: DataTypeEnum.NUMBER, inputValue: channelToUpdate && typeof (<Channel>channelToUpdate)?.feeProportionalMillionths !== 'undefined' ? (<Channel>channelToUpdate)?.feeProportionalMillionths : 100, min: 1, width: 48, hintFunction: this.percentHintFunction }
          ]
        }
      }
    }));
    this.rtlEffects.closeConfirm.
      pipe(takeUntil(this.unSubs[5])).
      subscribe((confirmRes) => {
        if (confirmRes) {
          const base_fee = confirmRes[0].inputValue;
          const fee_rate = confirmRes[1].inputValue;
          let updateRequestPayload: any = null;
          if (this.commonService.isVersionCompatible(this.information.version, '0.6.2')) {
            let node_ids = '';
            if (channelToUpdate === 'all') {
              this.activeChannels.forEach((channel) => {
                node_ids = node_ids + ',' + channel.nodeId;
              });
              node_ids = node_ids.substring(1);
              updateRequestPayload = { baseFeeMsat: base_fee, feeRate: fee_rate, nodeIds: node_ids };
            } else {
              updateRequestPayload = { baseFeeMsat: base_fee, feeRate: fee_rate, nodeId: (<Channel>channelToUpdate)?.nodeId };
            }
          } else {
            let channel_ids = '';
            if (channelToUpdate === 'all') {
              this.activeChannels.forEach((channel) => {
                channel_ids = channel_ids + ',' + channel.channelId;
              });
              channel_ids = channel_ids.substring(1);
              updateRequestPayload = { baseFeeMsat: base_fee, feeRate: fee_rate, channelIds: channel_ids };
            } else {
              updateRequestPayload = { baseFeeMsat: base_fee, feeRate: fee_rate, channelId: (<Channel>channelToUpdate)?.channelId };
            }
          }
          this.store.dispatch(updateChannel({ payload: updateRequestPayload }));
        }
      });
    this.applyFilter();
  }

  percentHintFunction(feeProportionalMillionths) {
    return (feeProportionalMillionths / 10000).toString() + '%';
  }

  onChannelClose(channelToClose: Channel, forceClose: boolean) {
    const alertTitle = (forceClose) ? 'Force Close Channel' : 'Close Channel';
    const yesBtnText = (forceClose) ? 'Force Close' : 'Close Channel';
    const titleMessage = (forceClose) ?
      ('Force closing channel: ' + ((!channelToClose.alias && !channelToClose.shortChannelId) ? channelToClose.channelId :
        (channelToClose.alias && channelToClose.shortChannelId) ? channelToClose.alias + ' (' + channelToClose.shortChannelId + ')' :
          channelToClose.alias ? channelToClose.alias : channelToClose.shortChannelId)) : ('Closing channel: ' +
      ((!channelToClose.alias && !channelToClose.shortChannelId) ? channelToClose.channelId :
        (channelToClose.alias && channelToClose.shortChannelId) ? channelToClose.alias + ' (' + channelToClose.shortChannelId + ')' :
          channelToClose.alias ? channelToClose.alias : channelToClose.shortChannelId));
    this.store.dispatch(openConfirmation({
      payload: {
        data: {
          type: AlertTypeEnum.CONFIRM,
          alertTitle: alertTitle,
          titleMessage: titleMessage,
          noBtnText: 'Cancel',
          yesBtnText: yesBtnText
        }
      }
    }));
    this.rtlEffects.closeConfirm.
      pipe(takeUntil(this.unSubs[6])).
      subscribe((confirmRes) => {
        if (confirmRes) {
          this.store.dispatch(closeChannel({ payload: { channelId: channelToClose.channelId, force: forceClose } }));
        }
      });
  }

  onChannelClick(selChannel: Channel, event: any) {
    this.store.dispatch(openAlert({
      payload: {
        data: {
          channel: selChannel,
          channelsType: 'open',
          component: ECLChannelInformationComponent
        }
      }
    }));
  }

  applyFilter() {
    this.channels.filter = this.selFilter.trim().toLowerCase();
  }

  getLabel(column: string) {
    const returnColumn: ColumnDefinition = this.nodePageDefs[this.PAGE_ID][this.tableSetting.tableId].allowedColumns.find((col) => col.column === column);
    return returnColumn ? returnColumn.label ? returnColumn.label : this.camelCaseWithSpaces.transform(returnColumn.column, '_') : column === 'announceChannel' ? 'Private' : this.commonService.titleCase(column);
  }

  setFilterPredicate() {
    this.channels.filterPredicate = (rowData: Channel, fltr: string) => {
      let rowToFilter = '';
      switch (this.selFilterBy) {
        case 'all':
          rowToFilter = JSON.stringify(rowData).toLowerCase();
          break;

        case 'announceChannel':
          rowToFilter = rowData?.announceChannel ? 'public' : 'private';
          break;

        default:
          rowToFilter = typeof rowData[this.selFilterBy] === 'undefined' ? '' : typeof rowData[this.selFilterBy] === 'string' ? rowData[this.selFilterBy].toLowerCase() : typeof rowData[this.selFilterBy] === 'boolean' ? (rowData[this.selFilterBy] ? 'yes' : 'no') : rowData[this.selFilterBy].toString();
          break;
      }
      return rowToFilter.includes(fltr);
    };
  }

  loadChannelsTable() {
    this.channels = new MatTableDataSource<Channel>([...this.activeChannels]);
    this.channels.sort = this.sort;
    this.channels.sortingDataAccessor = (data: any, sortHeaderId: string) => ((data[sortHeaderId] && isNaN(data[sortHeaderId])) ? data[sortHeaderId].toLocaleLowerCase() : data[sortHeaderId] ? +data[sortHeaderId] : null);
    this.channels.paginator = this.paginator;
    this.setFilterPredicate();
    this.applyFilter();
    this.logger.info(this.channels);
  }

  onDownloadCSV() {
    if (this.channels.data && this.channels.data.length > 0) {
      this.commonService.downloadFile(this.channels.data, 'ActiveChannels');
    }
  }

  ngOnDestroy() {
    this.unSubs.forEach((completeSub) => {
      completeSub.next(<any>null);
      completeSub.complete();
    });
  }

}
