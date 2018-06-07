import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystemBarcodes} from '../../../providers/mobile.app.system.barcodes'

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
  selector: 'page-barcode-scan-bin',
  templateUrl: 'barcode-scan-bin.html',
})


export class BarcodeScanBinPage {
@ViewChild('orderBarCodeInputBox') orderBarCodeInput ;
@ViewChild('zoneSelector') zoneSelector;  
  
  public orderBarCode:string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private keyboard:Keyboard,
    private platform: Platform,
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystemBarcodes, 
    private alertService:AlertService) 
  {

    this.orderBarCode = '';
    CustomKeyBoard.hide();
    this.timerTick();    
  }

  timerTick()
  {
    setTimeout(() => {
      if(this.navCtrl.getActive().id == "BarcodeScanBinPage" && this.mobileAppSystem.isBusy()==false)
      {
        if (this.platform.is('cordova'))
          this.keyboard.close();

        if(CustomKeyBoard.isVisible() ==false)
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
      this.timerTick();
    },100); //a least 150ms.
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeScanBinPage');
  }

  openPage() {
    let svc = this;
    if(this.orderBarCode == '')
      return;

    this.mobileAppSystem.GetBinDetails(this.user.sessionInfo.userWarehouse,this.orderBarCode, function(res:any){
      if(res==null || res.result==null)return;
      if(res.result)
      {
        svc.orderBarCode = '';
        if(res.result.statusMsg != null && res.result.statusMsg != '')
          // svc.modalService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK', 'default', 'barcode');
        svc.alertService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK');        
        return;
      }

      svc.user.orderInfo.binLocations = res.result.binLocationList;
      svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
      svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
      svc.user.orderInfo.orderBarcode = res.result.orderNumber;
      svc.user.orderInfo.toteNumber = res.result.toteNumber;
      svc.user.orderInfo.warehouse = svc.user.sessionInfo.userWarehouse;

      svc.navCtrl.setRoot('BarcodeBinDetailsPage');
    });

  }

  onChangedOrderBarcode(val:any)
  {    

    if(val==null || val=='')
      return;
    this.openPage();

  }

  onChangeZone()
  {
    this.selectOrderBarcodeInput();
  }

  selectOrderBarcodeInput()
  {
    setTimeout(() => {
    this.orderBarCodeInput.setFocus();
    },300); //a least 150ms.
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
