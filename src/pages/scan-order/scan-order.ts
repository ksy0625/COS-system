import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import {MobileAppSystem} from '../../providers/mobile.app.system'
import {AlertService} from '../../providers/alert.service'
import {User} from '../../providers/user'

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
  @ViewChild('zoneSelector') zoneSelector ;
  

  public zoneCodes:string[];
  public zoneCode:string = '';
  public orderBarCode:string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystem, 
    private alertService:AlertService) 
  {

    this.orderBarCode = '16515903';

    //init zone list
    let svc = this;
    this.mobileAppSystem.initialiseConveyorPick(this.user.sessionInfo.userWarehouse, function(res:any){
      if(res==null)return;

      svc.user.allowableProductsNotInTote = res.result.allowableProductsNotInTote;
      svc.zoneCodes = res.result.pickZonesList; 
      svc.orderBarCodeInput.setFocus();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanOrderPage');
    this.orderBarCodeInput.setFocus();
  }

  openPage() {

    if(this.orderBarCode == '' || this.zoneCode=='')
      return;

    let svc = this;    
    this.mobileAppSystem.scanOrderBarcode(this.orderBarCode, this.user.sessionInfo.userWarehouse,this.zoneCode, function(res:any){
      if(res==null)return;
      if(res.result.binLocationList == null)
      {
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


      svc.events.publish('scan:order');
      svc.navCtrl.push('ScanProductPage');
    });

  }

  onChangedOrderBarcode(val:any)
  {    
    let svc = this;
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


}
