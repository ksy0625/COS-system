import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemPutAway} from '../../../providers/mobile.app.system.putaway'
import {User,PutawayLineDetail} from '../../../providers/user'
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
  selector: 'page-put-away-source',
  templateUrl: 'put-away-source.html'
})
export class PutAwaySourcePage{
  putawayLineDetail:PutawayLineDetail;
  imageUrl :string = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemPutAway,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.putawayLineDetail = this.user.putwayInfo.putawayLineDetail;
    this.imageUrl = this.putawayLineDetail.image + '?' + new Date().toISOString(); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PutAwaySourcePage');
  }

  openPage()
  {    
    this.navCtrl.push('PutAwayDestPage');
  }
  updateImageUrl(event:any)
  {
    this.imageUrl = this.putawayLineDetail.image;
  }      
    
}
