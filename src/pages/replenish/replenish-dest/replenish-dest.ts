import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemReplenish} from '../../../providers/mobile.app.system.replenish'
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
  selector: 'page-replenish-dest',
  templateUrl: 'replenish-dest.html'
})
export class ReplenishDestPage{

  // @ViewChild('barCodeInputBox') barCodeInput;
  // @ViewChild('confirmedInputBox') confirmInput;

  // productBarCode:string = '';
  // confirmedPick:string='';

  // putawayLineDetail:PutawayLineDetail;
  // imageUrl :string = '';
  // confirmedPickFocused:boolean = false;

  // private chk0:boolean=false;
  // private chk1:boolean=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemReplenish,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {
    // this.putawayLineDetail = this.user.putwayInfo.putawayLineDetail;
    // this.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ this.putawayLineDetail.stk_code + '.jpg';

    // CustomKeyBoard.hide();
    // this.timerTick();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }

  timerTick()
  {
    // let svc = this;
    // setTimeout(() => {

    //   if(this.navCtrl.getActive().id !="PutAwayDestPage"  || this.mobileAppSystem.isBusy()==true)
    //   {
    //     this.timerTick();
    //     return;
    //   }

    //   let visibleKeypad = CustomKeyBoard.isVisible();            

    //   if (svc.platform.is('cordova'))
    //    svc.keyboard.close();

    //    if(svc.confirmedPickFocused ==false)
    //    {
    //      if(visibleKeypad==false )
    //      {
    //        if(svc.barCodeInput._isFocus ==false)
    //        {
    //          svc.barCodeInput._readonly = true;
    //          svc.barCodeInput.setFocus(); 
    //          setTimeout(() =>{
    //            svc.barCodeInput._readonly = false;
    //          }, 40);                 
    //        }               
    //      }
    //   }
    //   svc.timerTick();

    // },100); //a least 150ms.
  }

  onShowKeyPad()
  {
    // let svc = this;
    // if(CustomKeyBoard.isVisible())
    //    CustomKeyBoard.hide();
    // else
    // {
    //   CustomKeyBoard.show();    
    //   CustomKeyBoard.setTarget(svc.barCodeInput, function(val:string){
    //   });
    // }
  }

  hideKeyboard()
  {    
//    CustomKeyBoard.hide();
  }

  onConfirmQtyFocused()
  {
    // let svc = this;
    // this.confirmedPick = '';
    // this.confirmedPickFocused = true;    

    // CustomKeyBoard.show();
    // CustomKeyBoard.setTarget(this.confirmInput, function(val:string){
    //   svc.confirmedPick = val;
    //   svc.confirmedPickFocused = false;
    // });
  }  

  onClickBarcode()
  {
    // if(this.confirmedPickFocused ==true)
    // {
    //   CustomKeyBoard.hide();
    //   this.confirmedPickFocused = false;
    // }
  }

  openPage()
  {
    let svc = this;
    svc.navCtrl.push('ReplenishConfirmPage');
    // this.mobileAppSystem.putaway_completePutawayLine(svc.putawayLineDetail.task_id, svc.putawayLineDetail.warehouse,
    //   svc.putawayLineDetail.stk_code, svc.putawayLineDetail.to_bin, svc.putawayLineDetail.putaway_qty,
    //   svc.productBarCode, Number(svc.confirmedPick), function(res:any){
    //     if(res==null || res.result==null)return;
    //     if(res.result.statusCode==200)
    //     {
    //       svc.navCtrl.setRoot('PutAwayJobListPage');
    //     }
    //     else
    //     {
    //         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(res:any){
    //         });
    //     }
    // });    
  }

  updateImageUrl(event:any)
  {
    // this.imageUrl = this.putawayLineDetail.image;
  }        
    
}
