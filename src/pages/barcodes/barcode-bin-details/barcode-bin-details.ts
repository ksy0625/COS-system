import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemBarcodes} from '../../../providers/mobile.app.system.barcodes'
import {User} from '../../../providers/user'
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemBarcodes,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

//    this.putawayLineDetail = this.user.putwayInfo.putawayLineDetail;
//    this.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ this.putawayLineDetail.stk_code + '.jpg';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeBinDetailsPage');
  }

  openPage()
  {    
    this.navCtrl.setRoot('BarcodeScreenPage');
  }
  updateImageUrl(event:any)
  {
    //this.imageUrl = this.putawayLineDetail.image;
  }      
    
}
