import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Channel } from '../../../shared/models/clnModels';
import { ScreenSizeEnum } from '../../../shared/services/consts-enums-functions';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'rtl-cln-channel-liquidity-info',
  templateUrl: './channel-liquidity-info.component.html',
  styleUrls: ['./channel-liquidity-info.component.scss']
})
export class CLNChannelLiquidityInfoComponent implements OnInit {

  @Input() direction: string;
  @Input() totalLiquidity: number;
  @Input() activeChannels: Channel[];
  @Input() errorMessage: string;
  public screenSize = '';
  public screenSizeEnum = ScreenSizeEnum;

  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.screenSize = this.commonService.getScreenSize();
  }

  goToChannels() {
    this.router.navigateByUrl('/cln/connections');
  }

}
