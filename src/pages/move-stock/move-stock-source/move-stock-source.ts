import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemMoveStock} from '../../../providers/mobile.app.system.movestock';
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

 export class MoveStockSourceData{
  fromBinCode:string='';
  sourceMainWH:string='';
  binClass:string='';
  binQty:number=0;
  binType:string='';
  description:string='';
  maxQty:number=0;
  putaways:number=0;
  replens:number=0;
  sos:number=0;
  stockCode:string='';
  img_url:string='';
 }

@IonicPage()
@Component({
  selector: 'page-move-stock-source',
  templateUrl: 'move-stock-source.html'
})
export class MoveStockSourcePage{

  @ViewChild('barCodeInputBox') barCodeInput;
  productBarCode:string = '';
  moveStockSourceData:MoveStockSourceData = new MoveStockSourceData();
  bDataChecked:boolean = false;

  binQty:string='';
  maxQty:string='';
  putaways:string='';
  replens:string='';
  sos:string='';

  private imageUrl:string='';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemMoveStock,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.timerTick();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MoveStockSourcePage');
  }

  timerTick()
  {
    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id !="MoveStockSourcePage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();
      if (svc.platform.is('cordova'))
        svc.keyboard.close();
      if(visibleKeypad==false)
      {
        if(svc.barCodeInput._isFocus ==false)
        {
          svc.barCodeInput._readonly = true;
          svc.barCodeInput.setFocus();            
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
        svc.onChangedBarCode(val);
      });
    }
  }

  hideKeyboard()
  {    
    CustomKeyBoard.hide();
  }
  
  checkBarcod()
  {
    let svc = this;    
    if(this.productBarCode =='')return;
    this.mobileAppSystem.moveStock_getSourceBinDetails(this.user.sessionInfo.userWarehouse, this.productBarCode, function(res:any){
      if(res==null || res.result==null)return;
      if(res.result.statusCode==200)
      {
        svc.moveStockSourceData = res.result;
        svc.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ res.result.stockCode + '.jpg';        

        svc.bDataChecked = true;
        svc.user.movestockInfo.fromBinCode = res.result.fromBinCode;
        svc.user.movestockInfo.sourceMainWH = res.result.sourceMainWH;
        svc.user.movestockInfo.sourceBinQty = res.result.binQty;
        svc.user.movestockInfo.sourceStockCode = res.result.stockCode;
        svc.user.movestockInfo.sourceBinImage = svc.imageUrl;

        svc.binQty = String(svc.moveStockSourceData.binQty);
        svc.maxQty = String(svc.moveStockSourceData.maxQty);
        svc.putaways = String(svc.moveStockSourceData.putaways);
        svc.replens = String(svc.moveStockSourceData.replens);
        svc.sos = String(svc.moveStockSourceData.sos);

      }
      else
      {
         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean){
         });
      }
    }); 
  }

  onChangedBarCode(value:string)
  {
    if(value != '')
      this.checkBarcod();
    //moveStock_getBinDetails
  }
   
  openPage()
  {
    if(this.bDataChecked==false)return;
    this.navCtrl.setRoot('MoveStockDestPage');
  }
  updateImageUrl(event:any)
  {
    this.imageUrl = this.moveStockSourceData.img_url;
  }      
    
}
