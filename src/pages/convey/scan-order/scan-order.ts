import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystem} from '../../../providers/mobile.app.system'
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
  selector: 'page-scan-order',
  templateUrl: 'scan-order.html',
})


export class ScanOrderPage {
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
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystem, 
    private alertService:AlertService) 
  {

    this.orderBarCode = '';

    //init zone list
    let svc = this;
    this.mobileAppSystem.initialiseConveyorPick(this.user.sessionInfo.userWarehouse, function(res:any){
      if(res==null)return;

      svc.user.allowableProductsNotInTote = res.result.allowableProductsNotInTote;
      svc.user.hasTotes = res.result.hasTotes;
      if(svc.user.hasTotes ==null)
        svc.user.hasTotes = '';
      svc.zoneCodes = res.result.pickZonesList; 
      svc.zoneCode = svc.user.orderInfo.zone;
    });

    CustomKeyBoard.hide();
    this.timerTick();    
  }

  timerTick()
  {
    setTimeout(() => {
      if(this.navCtrl.getActive().id == "ScanOrderPage" && this.mobileAppSystem.isBusy()==false)
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
    console.log('ionViewDidLoad ScanOrderPage');
  }

  openPage() {

    if(this.orderBarCode == '')
      return;

    if(this.zoneCodes!=null && this.zoneCodes.length >0 && this.zoneCode=='')
      return;

    if(this.zoneCodes==null)
      this.zoneCode = "";

    let svc = this;    
    this.mobileAppSystem.scanOrderBarcode(this.orderBarCode, this.user.sessionInfo.userWarehouse,this.zoneCode, function(res:any){
      if(res==null)return;
      if(res.result.binLocationList == null)
      {
        svc.orderBarCode = '';
        if(res.result.statusMsg != null && res.result.statusMsg != '')
          // svc.modalService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK', 'default', 'barcode');
        svc.alertService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK');        
        return;
      }

      svc.user.orderInfo.zone = svc.zoneCode;
      svc.user.orderInfo.binLocations = res.result.binLocationList;
      svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
      svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
      svc.user.orderInfo.orderBarcode = res.result.orderNumber;
      svc.user.orderInfo.toteNumber = res.result.toteNumber;
      svc.user.orderInfo.warehouse = svc.user.sessionInfo.userWarehouse;

      svc.events.publish('convey:startscan');
      svc.navCtrl.setRoot('ScanProductPage');
    });

  }

  onChangedOrderBarcode(val:any)
  {    

    if(val==null || val=='')
      return;

    if(this.zoneCodes==null || this.zoneCodes.length ==0)
      this.openPage();
    else if(this.zoneCode !='')
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
