import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystemBinInfo} from '../../../providers/mobile.app.system.bin'
import {AlertService} from '../../../providers/alert.service'
import {User} from '../../../providers/user'
import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the ScanOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-bin',
  templateUrl: 'scan-bin.html',
})


export class ScanBinPage {
@ViewChild('orderBarCodeInputBox') orderBarCodeInput ;
@ViewChild('zoneSelector') zoneSelector;  
  
  public zoneCodes:string[];
  public zoneCode:string = '';
  public orderBarCode:string = '';


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private keyboard:Keyboard,
    private platform: Platform,
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystemBinInfo, 
    private alertService:AlertService) 
  {

    CustomKeyBoard.hide();
    this.timerTick();    
  }

  timerTick()
  {
    setTimeout(() => {
      if(this.navCtrl.getActive().id == "ScanBinPage" && this.mobileAppSystem.isBusy()==false)
      {
        if (this.platform.is('cordova'))
          this.keyboard.close();

        if(CustomKeyBoard.isVisible() ==false)
        {
          if(this.zoneCodes==null || this.zoneCodes.length==0  || (this.zoneCodes.length >0 && this.zoneSelector._isFocus ==false))
          {
            if(this.orderBarCodeInput._isFocus ==false)
            {              
              this.orderBarCodeInput._readonly = true;
              this.orderBarCodeInput.setFocus();
              setTimeout(() =>{
                this.orderBarCodeInput._readonly = false;
              }, 50);              
            }
          }
        }
      }

      this.timerTick();
    },100); //a least 150ms.
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanBinPage');
  }

  openPage() {

    let svc = this;
    this.mobileAppSystem.binInfo_getBinDetails(this.user.sessionInfo.userWarehouse, this.orderBarCode,function(res:any){
      if(res==null || res.result==null)return;
      if(res.result.statusCode==200)
      {
        svc.user.binInfo.binDetailes = res.result;
        svc.navCtrl.setRoot('BinDetailesPage');
      }
      else
      {
          svc.alertService.doAlert('Error', res.result.statusMsg, 'OK');
          return;        
      }

    }); 
  }

  onChangedOrderBarcode(val:any)
  {    
    if(val==null || val=='')
      return;
    this.openPage();
  }


  onShowKeyPad()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();
      CustomKeyBoard.setTarget(this.orderBarCodeInput, function(val:string){
         svc.onChangedOrderBarcode(val);
      });
    }
  }

}
