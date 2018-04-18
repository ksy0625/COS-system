import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import {MobileAppSystem1Line} from '../../../providers/mobile.app.system.1line'
import {User} from '../../../providers/user'
import {ModalService} from '../../../providers/modal.service'
import {AlertService} from '../../../providers/alert.service'

import { Keyboard } from '@ionic-native/keyboard';
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the PlacInTotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-line-process-job',
  templateUrl: 'line-process-job.html',
})
export class LineProcessJobPage {
  private title:string=''; 
  private bBinLocationScaning:boolean = false;
  private productBarcode:string=''; 
  @ViewChild('productBarCodeInputBox') productBarCodeInput ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
          private platform: Platform,
  			  public mobileAppSystem:MobileAppSystem1Line,
          private keyboard:Keyboard,
  	    	private alertService:AlertService, 
          private modalService:ModalService,
          public translateService:TranslateService,
  			  public user:User) {
    
    let svc = this;
    translateService.get('LINE_PROCESS_JOB_TITLE').subscribe(
      value => {
        svc.title = value + String(user.lineinfo.jobID);
      }
    ); 


    CustomKeyBoard.hide();
    this.timerTick();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LineProcessJobPage');
  }

private inputBinLocationCode()
{
  let svc = this;
  this.bBinLocationScaning = true;
  this.modalService.doPrompt('Scan or Enter Bin Location', '', 'Go', 'Cancel','', 'BinLocation').then(function(binLocationCode)
  {
      svc.bBinLocationScaning = false;
      if(binLocationCode == '')
          return;
      svc.mobileAppSystem.singleLine_getNextProduct(svc.user.lineinfo.jobID, svc.user.sessionInfo.userWarehouse, binLocationCode,
        "B", function(res:any)
        {
          if(res==null || res.result==null)return;
          if(res.result.statusCode != 200)
          {   
              svc.alertService.doAlert('Bin Location Not Found!', res.result.statusMsg, 'OK');
              return;
          }
          else
          {
            svc.user.lineinfo.barcodetype = 'B';
            svc.user.lineinfo.productInfo = res.result;
            svc.navCtrl.push('LinePickOrderPage');            
          }
      });                  
  });
}


  openPage() {
    if(this.productBarcode=='')
      return;    
    let svc = this;    
    this.mobileAppSystem.singleLine_getNextProduct(this.user.lineinfo.jobID, this.user.sessionInfo.userWarehouse, this.productBarcode, 'P',function(res:any){
      if(res==null|| res.result==null)return;
      if(res.result.statusCode != 200)
      {        
        svc.alertService.doConfirm('Product Barcode Not Found!', res.result.statusMsg, 'Scan Bin', 'OK').then(function(ret:boolean)
        {
          svc.productBarcode = '';
          if(ret)
              svc.inputBinLocationCode();
          
        });
      }
      else
      {
        svc.user.lineinfo.barcodetype = 'P';
        svc.user.lineinfo.productInfo = res.result;
        svc.navCtrl.push('LinePickOrderPage');
      }
    });


  }

  onChangedBarcode(val:any)
  {    
   
    if(val==null || val=='')
      return;
    this.openPage();
  }


  timerTick()
  {
    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id !="LineProcessJobPage" ||  this.mobileAppSystem.isBusy()==true || this.bBinLocationScaning==true)
      {
        this.timerTick();
        return;
      }  

      if (this.platform.is('cordova'))
        this.keyboard.close();

      if(this.productBarCodeInput._isFocus ==false)          
      {
         this.productBarCodeInput._readonly = true;
         this.productBarCodeInput.setFocus(); 
         setTimeout(() =>{
           svc.productBarCodeInput._readonly = false;
         }, 40);
      }
       

      svc.timerTick();

    },100); //a least 150ms.
  }

  onShowKeyPad()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(this.productBarCodeInput, function(val:string){
        svc.onChangedBarcode(val);
      });      
    }
  }

  onGotoHome()
  {
    this.navCtrl.setRoot('HomeScreenPage');
  }  
  
}
