import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystem1Line} from '../../../providers/mobile.app.system.1line'
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
export class SurplusBin{
    bin_code :string;
    qty:number; 
}

export class LineProductInfo{
  countOrdersPicked:number = 0;
  countTotalOrders:number = 0;
  statsLabelProgress:string;
  statsPickEfficiency:string;

  jobID:number=0; 
  stockCode:string= '';  
  description:string= '';
  binLocation:string = '';  
  orderNumber:string='';

  pickQty:number=0;
  pickUnit:string= '';

  img_url:string= '';
  productPickComplete:string='N';
  jobComplete:string='N';

}


@IonicPage()
@Component({
  selector: 'page-line-pick-order',
  templateUrl: 'line-pick-order.html'
})
export class LinePickOrderPage {

  @ViewChild('barCodeInputBox') barCodeInput;
  @ViewChild('confirmedInputBox') confirmInput;

  private productBarCode:string = '';
  private titleDefault :string; 
  private title :string;
  private bLastPressReturnKey:boolean = true;
  private bBinLocationScaning:boolean = false;
  private productInfo: LineProductInfo;
  private confirmedPick :string;
  private confirmedPickFocused :boolean = false;
  private statusMsg:string = '';
  private surplusBins: SurplusBin[]=[];
  private imageUrl:string = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystem1Line,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {
    this.title = '';
    this.titleDefault = '';
    this.productInfo = new  LineProductInfo();
    this.confirmedPick = '';

    let svc = this;
    translateService.get('LINE_PICK_ORDERS_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
      }
    ); 

    this.productInfo = this.user.lineinfo.productInfo;
    this.confirmedPick = String(this.productInfo.pickQty);
    this.title = this.titleDefault + " : " + this.productInfo.countOrdersPicked + " of " + svc.productInfo.countTotalOrders + " done";

    CustomKeyBoard.hide();
    this.timerTick();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }


private getNextOrderToPick()
{
  let svc = this; 
  svc.productBarCode = '';
  svc.mobileAppSystem.singleLine_getNextOrderToPick(svc.user.lineinfo.jobID, svc.user.sessionInfo.userWarehouse, 
    svc.productInfo.stockCode, svc.productInfo.binLocation, function(res:any)
  {
    if(res==null || res.result==null)return;
    if(res.result.statusCode!=200)
    {
        svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean)
        {
          return;
        });
    }
    else
    {
      svc.productInfo = res.result;
      svc.confirmedPick = String(svc.productInfo.pickQty);
      //svc.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ res.result.stockCode + '.jpg';             
      svc.imageUrl = res.result.img_url+ '?' + new Date().toISOString();
      svc.title = svc.titleDefault + " : " + svc.productInfo.countOrdersPicked + " of " + svc.productInfo.countTotalOrders + " done";
    }
  });  
}



private callConfirmQty()
{
  let svc = this;
  if(this.confirmedPick =='')
    return;
}



processStep3(statusMsg:string)
{
  let svc = this;

  if(svc.productInfo.jobComplete == 'Y')
  {
    svc.alertService.doAlertWithtimeOut(statusMsg,'', 2000).then(function(yes){
        svc.navCtrl.setRoot('LinePickJobPage');
    });
    return;
  }
  
  if(svc.productInfo.productPickComplete == 'Y')
  {
    svc.alertService.doAlertWithtimeOut('Success!', statusMsg, 2000).then(function(yes){
        svc.navCtrl.setRoot('LineProcessJobPage');
    });
  }
  else
  {
    svc.alertService.doAlert('Success!', statusMsg, 'OK').then(function(any){
      svc.getNextOrderToPick();      
    });
  }
}


checkConfirmQty(strMsg:string)
{
  // let svc = this;
  // if(this.confirmedPick=='')
  //   return;
  // let confQty = Number(this.confirmedPick);
  // if(confQty != this.productInfo.pickQty)
  // {
  //     svc.mobileAppSystem.singleLine_updateOrderPickStatus(svc.user.lineinfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
  //       svc.productInfo.binLocation, svc.productInfo.orderNumber, confQty, "N", svc.productBarCode, function(res:any)
  //       {
  //         if(res==null || res.result==null)return;
  //         if(res.result.statusCode!= 200)
  //         {   
  //           svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(any)
  //           {
  //             svc.productBarCode = '';
  //           });
  //         }
  //         else
  //         { 
  //             if(res.result.surplusBins!=null)
  //               svc.surplusBins = res.result.surplusBins;
  //             else
  //               svc.surplusBins =[];

  //             if(res.result.jobComplete =='N')
  //               svc.user.lineinfo.productBins = res.result.productBins;


  //             let data={surplusBins: svc.surplusBins, productInfo:svc.productInfo, entered:svc.confirmedPick};
  //             svc.modalService.showConfirmModal('LineConfirmQtyPage', 'inset-modal_2', data).then(function(yes)
  //             {
  //                 if(yes!=1) //click No, remain current page
  //                   return;


  //                 svc.mobileAppSystem.singleLine_updateOrderPickStatus(svc.user.lineinfo.jobID, 
  //                   svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,svc.productInfo.binLocation, 
  //                   svc.productInfo.orderNumber, confQty, "Y", svc.productBarCode, function(res:any)
  //                   {
  //                       if(res==null || res.result==null)return;

  //                       if(res.result.statusCode== 200)
  //                       {
  //                         svc.productInfo.productPickComplete = res.result.productPickComplete;
  //                         svc.processStep3(res.result.statusMsg);
  //                       }
  //                       else
  //                       {
  //                         svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(any)
  //                         {
  //                         });                          
  //                       }
  //                   });
  //             });
  //         }
  //     });  
  // }
  // else
  //   svc.processStep3(strMsg);


  let svc = this;
  if(this.confirmedPick=='')
    return;
  let confQty = Number(this.confirmedPick);
  if(confQty != this.productInfo.pickQty)
  {
      let data={surplusBins: this.surplusBins, productInfo:this.productInfo, entered:this.confirmedPick};
      this.modalService.showConfirmModal('LineConfirmQtyPage', 'inset-modal_2', data).then(function(yes){
        if(yes==1)
        {
          svc.mobileAppSystem.singleLine_updateOrderPickStatus(svc.user.lineinfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
            svc.productInfo.binLocation, svc.productInfo.orderNumber, confQty, "Y", svc.productBarCode, function(res:any)
            {
              if(res==null || res.result==null)return;
              if(res.result.statusCode!= 200)
              {   
                svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(any){
                });
              }
              else
              { 
                svc.productInfo.productPickComplete = res.result.productPickComplete;
                if(res.result.surplusBins!=null)
                  svc.surplusBins = res.result.surplusBins;
                else
                  svc.surplusBins =[];

                if(res.result.jobComplete =='N')
                  svc.user.lineinfo.productBins = res.result.productBins;
                
                svc.processStep3(res.result.statusMsg);  
              }
          });  
        }
      });    
  }
  else
    svc.processStep3(strMsg);  
}

onChangedProductBarCode(val:any)
{
  if(val =='')return;
  this.productBarCode =  val;
  let svc = this;    
  svc.mobileAppSystem.singleLine_updateOrderPickStatus(svc.user.lineinfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
    svc.productInfo.binLocation, svc.productInfo.orderNumber, Number(svc.confirmedPick) , "N", svc.productBarCode, function(res:any)
    {
      if(res==null || res.result==null)return;
      if(res.result.statusCode == 403)
      {           
        svc.alertService.doAlert('Order Label Barcode not found!', res.result.statusMsg, 'OK').then(function(any){
          svc.productBarCode='';
        });
      }
      else if(res.result.statusCode == 402)
      { 
          svc.alertService.doConfirm(res.result.statusMsg, '', 'Goto Next Order','OK').then(function(any){
            svc.productBarCode='';
            if(any)
              svc.getNextOrderToPick();
          });
      }
      else if(res.result.statusCode == 200)    
      {
        svc.productInfo.jobComplete = res.result.jobComplete;
        svc.productInfo.productPickComplete = res.result.productPickComplete;

        if(res.result.surplusBins!=null)
          svc.surplusBins = res.result.surplusBins;
        else
          svc.surplusBins =[];

        if(res.result.jobComplete =='N')
          svc.user.lineinfo.productBins = res.result.productBins;

        svc.checkConfirmQty(res.result.statusMsg);
      }
      else
      {
        svc.alertService.doAlert(res.result.statusMsg, '', 'OK').then(function(any){
        });
      }
  });  

}

  timerTick()
  {
    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="LinePickOrderPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();            

      if(svc.bBinLocationScaning ==false)
      {
          if (svc.platform.is('cordova'))
           svc.keyboard.close();

         if(svc.confirmedPickFocused ==false)
         {
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

  onConfirmQtyFocused()
  {
    let svc = this;
    this.confirmedPick = '';
    this.confirmedPickFocused = true;    

    CustomKeyBoard.show();
    CustomKeyBoard.setTarget(this.confirmInput, function(val:string){
      svc.confirmedPick = val;
      svc.confirmedPickFocused = false;
    });
  }  

  onClickBarcode()
  {
    if(this.confirmedPickFocused ==true)
    {
      CustomKeyBoard.hide();
      this.confirmedPickFocused = false;
    }
  }

  onPrintClicked()
  {
      let svc = this;
      svc.mobileAppSystem.singleLine_getLabelPrinters(svc.user.lineinfo.jobID,
        svc.user.sessionInfo.userWarehouse, svc.productInfo.binLocation,function(res:any){
          if(res==null || res.result==null)return;

          let data={title:'Print Additional Packing Labels',
                    message:'', 
                    okTxt:'Print',
                    cancelTxt:'Cancel',
                   printers:res.result.printerList};
          
          svc.bBinLocationScaning = true;
          svc.modalService.showConfirmModal('LinePrinterSelModalPage', 'inset-modal_2', data).then(function(result:any){
            svc.bBinLocationScaning = false;
            if(result!=null)
            {
              svc.mobileAppSystem.singleLine_printAdditionalLabels(svc.user.lineinfo.jobID,
                svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode, svc.productInfo.binLocation, svc.productInfo.orderNumber,
                result.printer, Number(result.qty), function(res:any){
                  if(res==null || res.result==null)return;
                });
              //_printAdditionalLabels
            }
            else
            {

            }
          });

        });
  }
  updateImageUrl(event:any)
  {
    //this.imageUrl = this.productInfo.img_url;
  }    

    
}
