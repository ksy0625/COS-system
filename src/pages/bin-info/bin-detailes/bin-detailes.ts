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


@IonicPage()
@Component({
  selector: 'page-bin-detailes',
  templateUrl: 'bin-detailes.html'
})
export class BinDetailesPage {
  @ViewChild('confirmedInputBox') confirmInput;
  private imageUrl:string = '';
  private binDetailes:BinDetailes; 
  private confirmedPick:string=''; 


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,              
              public mobileAppSystem:MobileAppSystemBinInfo,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.binDetailes = this.user.binInfo.binDetailes;
    this.confirmedPick = String(this.binDetailes.binMaxQty);
    this.imageUrl =    this.binDetailes.stkImage;
    //this.imageUrl =  'http://int.cos.net.au/mobileappimages/'+ this.binDetailes.stockCode + '.jpg';

    CustomKeyBoard.hide();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }


  openPage() {
    let svc = this;
    this.mobileAppSystem.binInfo_updateBinMaxQty(this.user.sessionInfo.userWarehouse, this.binDetailes.binCode,
     Number(this.confirmedPick), function(res:any){
          if(res==null || res.result==null) return;
          if(res.result.statusCode==200)
          {
            svc.alertService.doAlert('Success', res.result.statusMsg, 'OK').then(function(res:any){
              svc.navCtrl.setRoot('ScanBinPage');
            });
          }
          else
          {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
            });
          }
     });
  }

  onConfirmQtyFocused()
  {
    let svc = this;
    svc.confirmedPick = '';

    CustomKeyBoard.show();
    CustomKeyBoard.setTarget(this.confirmInput, function(val:string){
          svc.onChangeConfirmQty();
    });
  }  

  onChangeConfirmQty()
  {
  }  

  updateImageUrl(event:any)
  {
    //this.imageUrl = this.binDetailes.stkImage;
  }    
  
}
