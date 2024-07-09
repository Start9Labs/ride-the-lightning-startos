import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Balance, LocalRemoteBalance, UTXO } from '../../../shared/models/clnModels';
import { LoggerService } from '../../../shared/services/logger.service';

import { RTLState } from '../../../store/rtl.state';
import { utxoBalances } from '../../store/cln.selector';
import { ApiCallStatusPayload } from '../../../shared/models/apiCallsPayload';

@Component({
  selector: 'rtl-cln-utxo-tables',
  templateUrl: './utxo-tables.component.html',
  styleUrls: ['./utxo-tables.component.scss']
})
export class CLNUTXOTablesComponent implements OnInit, OnDestroy {

  @Input() selectedTableIndex = 0;
  @Output() readonly selectedTableIndexChange = new EventEmitter<number>();
  public numUtxos = 0;
  public numDustUtxos = 0;
  public DUST_AMOUNT = 1000;
  private unSubs: Array<Subject<void>> = [new Subject(), new Subject()];

  constructor(private logger: LoggerService, private store: Store<RTLState>) { }

  ngOnInit() {
    this.store.select(utxoBalances).pipe(takeUntil(this.unSubs[0])).
      subscribe((utxoBalancesSeletor: { utxos: UTXO[], balance: Balance, localRemoteBalance: LocalRemoteBalance, apiCallStatus: ApiCallStatusPayload }) => {
        if (utxoBalancesSeletor.utxos && utxoBalancesSeletor.utxos.length > 0) {
          this.numUtxos = utxoBalancesSeletor.utxos.length || 0;
          this.numDustUtxos = utxoBalancesSeletor.utxos?.filter((utxo) => (+(utxo.amount_msat || 0) / 1000) < this.DUST_AMOUNT).length || 0;
        }
        this.logger.info(utxoBalancesSeletor);
      });
  }

  onSelectedIndexChanged(event) {
    this.selectedTableIndexChange.emit(event);
  }

  ngOnDestroy() {
    this.unSubs.forEach((completeSub) => {
      completeSub.next(<any>null);
      completeSub.complete();
    });
  }

}
