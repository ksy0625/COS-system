import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

import {MobileAppSystemBinInfo} from '../../../providers/mobile.app.system.bin'
import {User} from '../../../providers/user'
import { BinDetailes } from '../../../providers/user';
import {AlertService} from '../../../providers/alert.service'
import {ModalService} from '../../../providers/modal.service'
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the ScanProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export class BinStockDetail{
  stockCode:string='';
  stkDesc:string='';
  stkImage:string='';
  warehouse:string='';
  type:string='';
  stkClass:string='';
  avgCost:number=0;
  superceded:string='';
  dgNum:number=0;
  p2pQty:number=0;
  onHand:number=0;
  minDaysCover:number=0;
  maxDaysCover:number=0;
  binCode:string=''; 
}



@IonicPage()
@Component({
  selector: 'page-stock-detailes',
  templateUrl: 'stock-detailes.html'
})
export class StockDetailesPage {
  @ViewChild('confirmedInputBox') confirmInput;
  private imageUrl:string = '';
  private binDetailes:BinDetailes;   
  binStockDetail:BinStockDetail;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,              
              public mobileAppSystem:MobileAppSystemBinInfo,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.binStockDetail = new BinStockDetail();
    this.binDetailes = this.user.binInfo.binDetailes;
    this.getInfor();
  }

  getInfor()
  {
    let svc = this;
    this.mobileAppSystem.binInfo_getStockDetails(this.user.sessionInfo.userWarehouse, this.binDetailes.binCode,
      this.binDetailes.stockCode, function(res:any){
          if(res==null || res.result==null) return;
          if(res.result.statusCode==200)
          {
            svc.binStockDetail = res.result;
            svc.imageUrl =  'http://int.cos.net.au/mobileappimages/'+ svc.binStockDetail.stockCode + '.jpg';
          }
          else
          {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
          }
     });

        
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StockDetailesPage');
  }


  openPage() {
    this.navCtrl.setRoot('');
  }
  
  updateImageUrl(event:any)
  {
    this.imageUrl = this.binStockDetail.stkImage;
  }      
}
