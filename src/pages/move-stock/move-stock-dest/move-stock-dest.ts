import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemMoveStock} from '../../../providers/mobile.app.system.movestock'
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

 export class MoveStockDestData{
  destMainWH:string='';   
  description:string='';
  toBinCode:string='';  
  binClass:string='';
  binType:string='';
  realestate:number=0;
 }


@IonicPage()
@Component({
  selector: 'page-move-stock-dest',
  templateUrl: 'move-stock-dest.html'
})
export class MoveStockDestPage{

  @ViewChild('barCodeInputBox') barCodeInput;
  @ViewChild('moveQtyInputBox') moveQtyInput;  
  @ViewChild('maxQtyInputBox') maxQtyInput;    
  
  productBarCode:string = '';
  moveStockDestData:MoveStockDestData = new MoveStockDestData();
  bDataChecked:boolean = false;
  sourceMainWH:string='';
  sourceQty:number = 0;

  private moveQtyPick:string='';
  private maxQtyPick:string='0';
  private chk0:boolean=false;

  private barcodeInputfocused:boolean = true;
  private moveQtyInputfocused:boolean = false;  
  private maxQtyInputfocused:boolean = false;    
  private imageUrl:string = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemMoveStock,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.sourceMainWH = this.user.movestockInfo.sourceMainWH;
    this.sourceQty = this.user.movestockInfo.sourceBinQty;
    this.imageUrl   =  'http://int.cos.net.au/mobileappimages/'+ this.user.movestockInfo.sourceStockCode + '.jpg';    
    this.timerTick();
  }

  timerTick()
  {
    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id !="MoveStockDestPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();
      if (svc.platform.is('cordova'))
        svc.keyboard.close();

      if(visibleKeypad==false && svc.barcodeInputfocused==true)
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
    this.mobileAppSystem.moveStock_getDestinationBinDetails(this.user.sessionInfo.userWarehouse, this.productBarCode, 
      this.user.movestockInfo.sourceMainWH, this.user.movestockInfo.fromBinCode, this.user.movestockInfo.sourceStockCode,  function(res:any){
      if(res==null || res.result==null)return;
      if(res.result.statusCode==200)
      {
        svc.moveStockDestData = res.result;
        svc.bDataChecked = true;
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

  onClickBarcode()
  {
    this.barcodeInputfocused = true;
    this.moveQtyInputfocused = false;  
    this.maxQtyInputfocused = false;
    CustomKeyBoard.hide();
  }

  onMoveQtyFocused()
  {
    this.barcodeInputfocused = false;
    this.moveQtyInputfocused = true;
    this.maxQtyInputfocused = false;

    let svc = this;
    this.moveQtyPick = '';
    CustomKeyBoard.show();
    CustomKeyBoard.setTarget(this.moveQtyInput, function(val:string){
          svc.moveQtyInputfocused = false;
          svc.maxQtyInputfocused  = false;        
          svc.barcodeInputfocused = true;
    });

  }
  onMaxQtyFocused()
  {
    this.barcodeInputfocused = false;
    this.moveQtyInputfocused = false;
    this.maxQtyInputfocused = true;
    let svc = this;
    this.maxQtyPick = '';
    CustomKeyBoard.show();
    CustomKeyBoard.setTarget(this.maxQtyInput, function(val:string){
          svc.moveQtyInputfocused = false;
          svc.maxQtyInputfocused  = false;        
          svc.barcodeInputfocused = true;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }

  openPage()
  {    
    if(this.bDataChecked==false)return;
    if(Number(this.moveQtyPick) ==0)return;

    let svc = this;    
    this.mobileAppSystem.moveStock_UpdateMoveBin(this.user.movestockInfo.sourceStockCode, this.sourceMainWH, this.user.movestockInfo.fromBinCode,
      this.moveStockDestData.destMainWH,this.moveStockDestData.toBinCode, this.moveStockDestData.realestate, Number(this.moveQtyPick),
      Number(this.maxQtyPick), function(res:any)
      {
        if(res==null || res.result==null)return;
        if(res.result.statusCode==200)
        {
           svc.alertService.doAlert(res.result.statusMsg, '', 'OK').then(function(ret:boolean){
             svc.navCtrl.setRoot('MoveStockSourcePage');
           });
        }
        else
        {
           svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean){
           });
        }
    });     
  }

  updateImageUrl(event:any)
  {
    this.imageUrl = this.user.movestockInfo.sourceBinImage;
  }      

  onCheckPrinter(rmchecked:boolean)
  {
    if(this.chk0==false || this.bDataChecked==false)
      return;

    //get printer label
    let svc = this;
    svc.mobileAppSystem.getLabelPrinters(svc.user.sessionInfo.userWarehouse,function(res:any){
      if(res==null || res.result==null)return;
      let data={title:'Print Label',
                    message:'', 
                    okTxt:'Print',
                    cancelTxt:'Cancel',
                   printers:res.result.printerList};
      svc.modalService.showConfirmModal('MoveStockPrinterSelModalPage', 'inset-modal_2', data).then(function(result:any){
        if(result!=null)
        {
          svc.mobileAppSystem.moveStock_printLabel(svc.moveStockDestData.toBinCode,            
            result.printer, function(res:any){
              if(res==null || res.result==null)return;              
            });
          //_printAdditionalLabels
        }
        else
        {
           svc.chk0 = false;
        }
      });

    });
  }

    
}
