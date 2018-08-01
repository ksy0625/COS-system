import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemBarcodes} from '../../../providers/mobile.app.system.barcodes'
import {User, BarcodeBinDetails} from '../../../providers/user'
import {AlertService} from '../../../providers/alert.service'
import {ModalService} from '../../../providers/modal.service'
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the ScanProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-barcode-bin-details',
  templateUrl: 'barcode-bin-details.html'
})
export class BarcodeBinDetailsPage{
  imageUrl :string = '';
  binDetails:BarcodeBinDetails;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemBarcodes,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.binDetails = this.user.barcodeInfo.binDetails;
    this.imageUrl = this.binDetails.imageUrl; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeBinDetailsPage');
  }
  ionViewWillLeave()
  {
  }  

  openPage()
  {    
    let svc = this;
    this.mobileAppSystem.GetBarcodes(this.binDetails.stockCode, function(res:any){
      if(res==null)return;
      if(res.status!=200)
      {
        if(res.statusMsg != null && res.statusMsg != '')
          svc.alertService.doAlert('GetBarcodes', res.statusMsg, 'OK');
        return;
      }

      svc.user.barcodeInfo.barcodes = res.data;
      svc.navCtrl.push('BarcodeScreenPage');
    });
  }
    
}
