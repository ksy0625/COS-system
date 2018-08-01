
//import { HostListener } from '@angular/core';


import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystem1Line} from '../../../providers/mobile.app.system.1line'
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
  selector: 'page-1line-pick-job',
  templateUrl: 'line-pick-job.html',
})


export class LinePickJobPage {
@ViewChild('lineBarCodeInputBox') lineBarCodeInput ;  

  didUnload:boolean = false;
  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) { 
  //   this.p2lBarCode += event.code;
  // }


  public lineBarCode:string = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private keyboard:Keyboard,
    private platform: Platform,
    public events: Events, public user:User, public mobileAppSystem:MobileAppSystem1Line, 
    private alertService:AlertService) 
  {

    this.lineBarCode = '';
  }

  timerTick()
  {
    if(this.didUnload==true)
      return;

    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id =="LinePickJobPage" && this.mobileAppSystem.isBusy()==false)
      {

        if (this.platform.is('cordova'))
          this.keyboard.close();

        if(CustomKeyBoard.isVisible() ==false)
        {
          if(this.lineBarCodeInput._isFocus ==false)
          {
           this.lineBarCodeInput._readonly = true;
           this.lineBarCodeInput.setFocus(); 
           setTimeout(() =>{
             svc.lineBarCodeInput._readonly = false;
           }, 40);

          }
        }
      }      
      this.timerTick();
    },100); //a least 150ms.
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinePickJobPage');
    this.didUnload=false;
  }

  ionViewWillEnter()
  {
    this.didUnload = false;
    CustomKeyBoard.hide();
    this.timerTick();
  }  
  
  ionViewWillLeave()
  {
    this.didUnload=true;
  }  

  openPage() {

    if(this.lineBarCode == '')
      return;

    let svc = this;    
    this.mobileAppSystem.singleLine_getJob(this.user.sessionInfo.userWarehouse,this.lineBarCode, function(res:any){
      if(res==null || res.result==null)return;
      if(res.result.statusCode != 200)
      { 

        svc.alertService.doAlert('Job Not Found!', res.result.statusMsg, 'OK').then(function(ret:boolean)
        {
          svc.lineBarCode = '';
          return;
        });
      }
      else
      {
        svc.user.lineinfo.jobID = res.result.jobID;
        svc.user.lineinfo.lineBarcode = svc.lineBarCode;
        svc.user.lineinfo.productBins = res.result.productBins; 
        svc.navCtrl.push('LineProcessJobPage');
      }
    });

  }

  onChangedLineBarcode(val:any)
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
      CustomKeyBoard.setTarget(this.lineBarCodeInput, function(val:string){
         svc.onChangedLineBarcode(val);
      });
    }
  }
}
