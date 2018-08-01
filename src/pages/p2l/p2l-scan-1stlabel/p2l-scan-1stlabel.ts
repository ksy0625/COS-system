import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemP2l} from '../../../providers/mobile.app.system.p2l'
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

export class ProductInfo{
  countProductScanned:number = 0;
  countTotalProducts:number = 0;

  jobID:number=0;  
  binLocation:string = '';
  description:string= '';
  img_url:string= '';
  jobComplete:number=0;
  pickQty:number=0;
  pickUnit:string= '';
  stockCode:string= '';
}


@IonicPage()
@Component({
  selector: 'page-p2l-scan-1stlabel',
  templateUrl: 'p2l-scan-1stlabel.html'
})
export class P2lScan1stlabelPage {
  @ViewChild('barCodeInputBox') barCodeInput;

  private productBarCode:string = '';
  private titleDefault :string; 
  private title :string;
  private productInfo: ProductInfo;
  didUnload:boolean = false;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemP2l,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {
    this.title = '';
    this.titleDefault = '';
    this.productInfo = new  ProductInfo();

    let svc = this;
    translateService.get('SCAN_1ST_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
      }
    ); 

    //init display
    this.getNext1stLabel();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }
  ionViewWillEnter()
  {
    this.didUnload = false;
    CustomKeyBoard.hide();
    this.timerTick();
  }  
  
  ionViewWillLeave()
  {
    this.didUnload = true;
  }     


private getNext1stLabel()
{
  let svc = this;
  this.mobileAppSystem.p2l_getNext1stLabel(this.user.p2linfo.jobID, function(res:any){
    if(res==null || res.result==null)return;
    svc.productInfo = res.result;
    svc.title = svc.titleDefault + " : " + svc.productInfo.countProductScanned + " of " + svc.productInfo.countTotalProducts + " done";        
  });
}


onChangedProductBarCode(val:any)
{
  if(val =='')return;
  this.productBarCode =  val;
  let svc = this;     

  this.mobileAppSystem.p2l_validate1stLabel(this.user.p2linfo.jobID, this.user.sessionInfo.userWarehouse, this.productInfo.stockCode, this.productBarCode, function(res:any){
    if(res==null || res.result==null) return;

    if(res.result.statusCode != 200)
    {   
        svc.productBarCode = '';
        svc.alertService.doAlert('Error', res.result.statusMsg, 'OK' ).then(function(yes){
        });
    }
    else
    {
        svc.user.p2linfo.p2lBarcode = val;
        svc.navCtrl.setRoot('P2lScanProductPage');
    }
  });
}

  timerTick()
  {
    if(this.didUnload)return;
    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="P2lScan1stlabelPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();            

      if (svc.platform.is('cordova'))
       svc.keyboard.close();

     if(visibleKeypad==false )
     {
       if(svc.barCodeInput._isFocus ==false)
       {
         this.barCodeInput._readonly = true;
         this.barCodeInput.setFocus(); 
         setTimeout(() =>{
           svc.barCodeInput._readonly = false;
         }, 40);         
       }               
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
      CustomKeyBoard.setTarget(this.barCodeInput, function(val:string){
        svc.onChangedProductBarCode(val);
      });
    }
  }

  hideKeyboard()
  {    
    CustomKeyBoard.hide();
  }

  openPage()
  {
    this.onChangedProductBarCode(this.productBarCode);
  }
    
}
