
//import { HostListener } from '@angular/core';


import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystemP2l} from '../../../providers/mobile.app.system.p2l'
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
  selector: 'page-p2l-begin-job',
  templateUrl: 'begin-job.html',
})


export class P2lBeginJobPage {
@ViewChild('p2lBarCodeInputBox') p2lBarCodeInput ;  

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) { 
  //   this.p2lBarCode += event.code;
  // }


  public p2lBarCode:string = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private keyboard:Keyboard,
    private platform: Platform,
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystemP2l, 
    private alertService:AlertService) 
  {

    this.p2lBarCode = '';
    CustomKeyBoard.hide();
    this.timerTick();
  }

  timerTick()
  {
    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id =="P2lBeginJobPage" && this.mobileAppSystem.isBusy()==false)
      {

        if (this.platform.is('cordova'))
          this.keyboard.close();

        if(CustomKeyBoard.isVisible() ==false)
        {
          if(this.p2lBarCodeInput._isFocus ==false)
          {
           this.p2lBarCodeInput._readonly = true;
           this.p2lBarCodeInput.setFocus(); 
           setTimeout(() =>{
             svc.p2lBarCodeInput._readonly = false;
           }, 40);

          }
        }
      }      
      this.timerTick();
    },100); //a least 150ms.
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad P2lBeginJobPage');
    this.navCtrl.popToRoot();
  }

  openPage() {

    if(this.p2lBarCode == '')
      return;

    let svc = this;    
    this.mobileAppSystem.p2l_getJob(this.user.sessionInfo.userWarehouse,this.p2lBarCode, function(res:any){
      if(res==null)return;
      if(res.result.statusCode != 200)
      {        
        svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(ret:boolean)
        {
        });
      }
      else
      {
        svc.user.p2linfo.jobID = res.result.jobID;
        svc.user.p2linfo.p2lBarcode = svc.p2lBarCode;
        svc.user.p2linfo.sortOrder = res.result.sortOrder;
        svc.navCtrl.setRoot('P2lScanProductPage');
      }
      svc.p2lBarCode = '';
      
    });

  }

  onChangedP2lBarcode(val:any)
  {    
    let svc = this;
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
      CustomKeyBoard.setTarget(this.p2lBarCodeInput, function(val:string){
         svc.onChangedP2lBarcode(val);
      });
    }
  }
}
