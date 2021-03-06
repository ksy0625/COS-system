import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import {MobileAppSystemReplenish} from '../../../providers/mobile.app.system.replenish'
import {User, PutAwayJobStatus} from '../../../providers/user'
import {ModalService} from '../../../providers/modal.service'
import {AlertService} from '../../../providers/alert.service'

import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the PlacInTotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export class replenish{
  stockCode:string='';
  from:string='';
  to:string='';
  qty:number=0;
  days:number=0;  
}

@IonicPage()
@Component({
  selector: 'page-replenish-all-bin',
  templateUrl: 'replenish-all-bin.html',
})

export class ReplenishAllBinPage {

  @ViewChild('orderBarCodeInputBox') orderBarCodeInput ;
  barcode:string='';
  daysVal:string='';
  isleCode:string='';

  replenishList: replenish[]=[];
  selectedStockCode:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystemReplenish,
          private keyboard:Keyboard,
          private platform: Platform,          
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
          public translateService:TranslateService,
  			  public user:User) {

    CustomKeyBoard.hide();
    this.timerTick();
  }

  timerTick()
  {

    // let svc = this;
    // setTimeout(() => {
    //   if(this.navCtrl.getActive().id !="ReplenishListPage"  || this.mobileAppSystem.isBusy()==true)
    //   {
    //     this.timerTick();
    //     return;
    //   }

    //   let visibleKeypad = CustomKeyBoard.isVisible();            
    //   if (svc.platform.is('cordova'))
    //    svc.keyboard.close();

    //    if(visibleKeypad==false )
    //    {
    //      if(svc.orderBarCodeInput._isFocus ==false)
    //      {
    //        svc.orderBarCodeInput._readonly = true;
    //        svc.orderBarCodeInput.setFocus(); 
    //        setTimeout(() =>{
    //          svc.orderBarCodeInput._readonly = false;
    //        }, 40);                 
    //      }               
    //    }
    //    svc.timerTick();
    // },100); //a least 150ms.

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ReplenishListPage');
    this.onRefreshList();
  }
  ionViewWillLeave()
  {
    this.replenishList = [] ;   
  }     

  onRefreshList(){

    this.replenishList = [
      {stockCode:'st1', from:'AA', to:'BB', qty:80, days:10},
      {stockCode:'st2', from:'AA', to:'BB', qty:80, days:10},
      {stockCode:'st3', from:'AA', to:'BB', qty:80, days:10},
    ];
    // let svc = this;
    // this.mobileAppSystem.putaway_getPutawayJobList(this.user.sessionInfo.userWarehouse, function(res:any){
    //     if(res==null || res.result==null)return;
    //     if(res.result.statusCode==200)
    //     {
    //       svc.jobList = res.result.putAwayJobs;
    //     }
    //     else
    //     {
    //         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
    //         });
    //     }
    // });
  }

  openPage() 
  {
    let svc = this;
    // if(this.barcode=='')
    //   return;

    // this.mobileAppSystem.putaway_getPutawayLineScan(this.user.sessionInfo.userWarehouse, this.barcode, function(res:any){
    //     if(res==null || res.result==null)return;
    //     if(res.result.statusCode==200)
    //     {
    //       svc.user.putwayInfo.putawayDetails = res.result.putawayListResponse;
    //       svc.user.putwayInfo.barcode = svc.barcode;
    //       //svc.jobList = res.result.putAwayJobs;
    //       svc.navCtrl.setRoot('PutAwayJobFoundPage');
    //     }
    //     else
    //     {
    //         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
    //         });
    //     }
    // });
    svc.navCtrl.push('ReplenishSourcePage');
  }

  onClickRow(stockCode:string)
  {
    this.selectedStockCode = stockCode;
  }

  onChangedProductBarCode(val:string)
  {
   //this.onClickRow(val) ; 
  }

  onClickBarcode()
  {
  }

  onShowKeyPad()
  {
    // let svc = this;
    // if(CustomKeyBoard.isVisible())
    //    CustomKeyBoard.hide();
    // else
    // {
    //   CustomKeyBoard.show();    
    //   CustomKeyBoard.setTarget(this.orderBarCodeInput, function(val:string){
    //     svc.onChangedProductBarCode(val);
    //   });
    // }
  }  


  onClickIsleCode()
  {

  }
  onClickDays()
  {

  }


}
