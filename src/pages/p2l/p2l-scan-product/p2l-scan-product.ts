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
export class SurplusBin{
    bin_code :string;
    qty:number; 
}

export class ProductInfo{
  countProductScanned:number = 0;
  countTotalProducts:number = 0;

  jobID:number=0;  
  binLocation:string = '';
  description:string= '';
  img_url:string= '';
  jobComplete:string="N";
  pickQty:number=0;
  pickUnit:string= '';
  stockCode:string= '';
  statsLabelProgress:string;
  statsPickEfficiency:string;
  lastLabel:string;
  surplusBins: SurplusBin[]=[];  
}


@IonicPage()
@Component({
  selector: 'page-p2l-scan-product',
  templateUrl: 'p2l-scan-product.html'
})
export class P2lScanProductPage {
  @ViewChild('barCodeInputBox') barCodeInput;
  @ViewChild('confirmedInputBox') confirmInput;

  private productBarCode:string = '';
  private titleDefault :string; 
  private title :string;
  private bLastPressReturnKey:boolean = true;
  private bBinLocationScaning:boolean = false;
  private productInfo: ProductInfo;
  private confirmedPick :string;
  private confirmedPickFocused :boolean = false;
  private pickUnitSensitive: boolean = false;

  private bValidateProductCode :boolean = false;
  private labelOfScanBarcode:string = 'Scan Product';
  private imageUrl:string = '';


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
    this.confirmedPick = '';

    let svc = this;
    translateService.get('SCANPRODUCT_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
      }
    ); 

    //init display
    this.getNextProduct();

    CustomKeyBoard.hide();
    this.timerTick();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }


private getNextProduct()
{
  this.bValidateProductCode = false;
  this.labelOfScanBarcode = 'Scan Product:';
  let svc = this;

  if (svc.productInfo.jobComplete=='Y')
  {
    if(svc.productInfo.lastLabel == svc.user.p2linfo.p2lBarcode)
    {
      // svc.mobileAppSystem.p2l_confirmPickQty(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.binLocation, svc.productInfo.stockCode,
      //   svc.productInfo.pickQty, Number(svc.confirmedPick), "", function(res:any)
      //   {
      //     if(res==null || res.result==null)return;
      //     if(res.result.statusCode!= 200)
      //     {   
      //       svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(any){
      //       });
      //     }
      //     else
      //     {
      //       svc.alertService.doAlert('Job Completed!', '', 'OK').then(function(any){
      //         svc.navCtrl.setRoot('P2lBeginJobPage');
      //       });                
      //     }
      //   });
      svc.alertService.doAlert('Job Completed!', '', 'OK').then(function(any){
        svc.navCtrl.setRoot('P2lBeginJobPage');
      });
      return;
    }
    else
    {
      svc.bBinLocationScaning=true;
      svc.modalService.doPrompt('Invalid Label!', 'This is the last product of this job. Please scan Last Label!', 'Go', 'Cancel','', 'Label Barcode').then(function(labelBarCode)
      {
          svc.bBinLocationScaning = false;
          svc.user.p2linfo.p2lBarcode = labelBarCode;
          svc.getNextProduct();
      }); 
      return;
    }
  }  

  svc.productBarCode = '';
  this.mobileAppSystem.p2l_getNextProduct(this.user.p2linfo.jobID, this.user.p2linfo.p2lBarcode, 
    svc.user.p2linfo.sortOrder,function(res:any){
      
    if(res==null)return;
    if(res.result.statusCode!=200)
    {
      svc.bBinLocationScaning = true;
      svc.modalService.doPrompt('Scan label barcode', res.result.statusMsg, 'Go', 'Cancel','', 'Label Barcode').then(function(labelBarCode)
      {
          svc.bBinLocationScaning = false;
          svc.user.p2linfo.p2lBarcode = labelBarCode;
          svc.getNextProduct();
      }); 
    }
    else
    {
      svc.productInfo = res.result;
      svc.confirmedPick = String(svc.productInfo.pickQty);
      svc.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ res.result.stockCode + '.jpg';
      svc.title = svc.titleDefault + " : " + svc.productInfo.countProductScanned + " of " + svc.productInfo.countTotalProducts + " done";
    }
  });
}

private getDestoryLabelBarcode(strTitle:string, strContent:string,success_cb:(result:any)=>void )
{
  let svc = this;  
  if(Number(this.confirmedPick) ==0)
  {
     success_cb(this.user.p2linfo.p2lBarcode);
     return;
  }
  else
  {
    svc.bBinLocationScaning = true;
    svc.modalService.doPrompt(strTitle, strContent, 'Go', 'Cancel','', 'Barcode Here').then(function(p2lLabelBarCode){
      svc.bBinLocationScaning = false;
      success_cb(p2lLabelBarCode);
    });
  }
}


private destroyP2LLabels(statusStr:string)
{
  let svc = this;
  let strtitle = '';
  let strContent = '';  
  if(statusStr != null)
  {
    var splitted = statusStr.split("\r\n", 2);
    if(splitted.length < 2)
      splitted = statusStr.split("\n", 2);

    if(splitted.length >= 2)
    {
      strtitle =splitted[0];
      strContent = splitted[1];
    }
  }

  svc.getDestoryLabelBarcode(strtitle, strContent, function(p2lLabelBarCode){
    if(p2lLabelBarCode == '')
        return;

    svc.mobileAppSystem.p2l_destroyLabels(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
      svc.productInfo.pickQty, Number(svc.confirmedPick), p2lLabelBarCode,  svc.productInfo.binLocation, function(res:any)
      {
        if(res==null)return;
        if(res.result.statusCode!= 200)
        {   
          svc.alertService.doAlert('P2L Label for this product is invalid', res.result.statusMsg, 'OK').then(function(res:any)
          {
              svc.destroyP2LLabels(statusStr);
              return;
          });
        }
        else
        {
          if(res.result.countLabelsRemaining > 0)
            svc.destroyP2LLabels(res.result.statusMsg);
          else
          {
            if(svc.productInfo.jobComplete =="N")
            {   
                svc.bBinLocationScaning = true;
                svc.modalService.doPrompt('Scan next label barcode', res.result.statusMsg, 'Go', 'Cancel','', 'Labelbarcode').then(function(labelbarCode)
                {
                    svc.bBinLocationScaning = false;
                    if(labelbarCode == '')
                        return;
                    svc.user.p2linfo.p2lBarcode =  labelbarCode;
                    svc.getNextProduct();
                });
              //svc.navCtrl.setRoot('P2lScan1stlabelPage');
            }
            else if(svc.productInfo.jobComplete =="Y")
            {
              svc.getNextProduct();
            }
          }
        }
      });
  }); 

}




private callConfirmQty()
{
  let svc = this;
  if(this.confirmedPick =='')
    return;

  svc.mobileAppSystem.p2l_confirmPickQty(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.binLocation, svc.productInfo.stockCode,
    svc.productInfo.pickQty, Number(this.confirmedPick), "", function(res:any)
    {
      if(res==null || res.result==null)return;
      
      if(res.result.statusCode!= 200)
      {   
        svc.alertService.doAlert('Error!', res.result.statusMsg, 'OK').then(function(any){
        });
        return;
      }

      //if user no changed the confirmed Qty
      if(Number(svc.confirmedPick) == svc.productInfo.pickQty)
      {
        svc.alertService.doAlertWithtimeOut(res.result.statusMsg, '', 2000).then(function(yes){
          svc.getNextProduct();
        });
        return;
      }

      //if confirmed Qty is different pickQty
      if(res.result.countTotalDestroyLabels > 0)    //confirmedQty < pickedQty , need delete labels
      {
        svc.productInfo.surplusBins = res.result.surplusBins;
        
        let data={productInfo: svc.productInfo, entered:svc.confirmedPick};
        svc.modalService.showConfirmModal('P2lConfirmQtyPage', 'inset-modal_2', data).then(function(nRet:number){
          if(nRet==1) //click yes
          {
            svc.destroyP2LLabels(res.result.statusMsg);
          }
          else if(nRet==3) //click park
          {
            svc.mobileAppSystem.p2l_parkProductPick(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
              svc.productInfo.binLocation,function(res:any){
                if(res==null)return;
                if(res.result.statusCode!= 200)
                {
                  svc.alertService.doAlert("Error!", res.result.statusMsg, "OK").then(function(yes){                      
                  });  
                }
                else
                {
                  svc.bBinLocationScaning = true;
                  svc.modalService.doPrompt('Scan next label barcode', '', 'Go', 'Cancel','', 'Label Barcode').then(function(labelBarCode)
                  {
                      svc.bBinLocationScaning = false;
                      svc.user.p2linfo.p2lBarcode = labelBarCode;
                      svc.getNextProduct();
                  }); 
                 //svc.navCtrl.setRoot('P2lScan1stlabelPage');
                }
            });
          }
        });          
      }
      else
      {
        svc.alertService.doAlertWithtimeOut('Product Scan successful!', '', 2000).then(function(yes){
          if(svc.productInfo.jobComplete =="N")
          {              

            svc.bBinLocationScaning = true;
            svc.modalService.doPrompt('Scan or Enter Label Barcode', '', 'Go', 'Cancel','', 'Labelbarcode').then(function(labelbarCode)
            {
                svc.bBinLocationScaning = false;
                if(labelbarCode == '')
                    return;
                svc.user.p2linfo.p2lBarcode =  labelbarCode;
                svc.getNextProduct();
            });
            //svc.navCtrl.setRoot('P2lScan1stlabelPage');
          }
          else if(svc.productInfo.jobComplete =="Y")
          {

            svc.alertService.doAlertWithtimeOut('"No Product to Scan, Job Complete!"', '', 2000).then(function(yes){
              svc.navCtrl.setRoot('P2lBeginJobPage');
            });            
          }
        });
      }

  });  

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
      svc.mobileAppSystem.p2l_validateProductBinBarcode(svc.user.p2linfo.jobID, svc.user.sessionInfo.userWarehouse, svc.productInfo.stockCode,
        binLocationCode, function(res:any)
        {
          if(res==null)return;
          if(res.result.statusCode != 200)
          {   
              svc.alertService.doAlert('Bin Location Not Found!', res.result.statusMsg, 'OK');
              return;
          }
          else
          {
            svc.alertService.doAlertWithtimeOut(res.result.statusMsg, '', 2000).then(function(yes)
            {
              svc.bValidateProductCode = true; 
              svc.labelOfScanBarcode = 'Scan Label:';
            });
          }
      });                  
  });
}


onChangedProductBarCode(val:any)
{
  if(this.pickUnitSensitive==true)
    return;
  if(val =='')return;
  this.productBarCode =  val;
  let svc = this;


  if(svc.bValidateProductCode==false)
  {
    this.mobileAppSystem.p2l_validateProductBarcode(this.user.p2linfo.jobID, this.user.sessionInfo.userWarehouse, this.productInfo.stockCode, this.productBarCode, function(res:any){
      svc.productBarCode = '';
      if(res==null) return;

      if(res.result.statusCode != 200)
      {   
          svc.alertService.doConfirm('Product Barcode Not Found!', "", 'Re-Scan Product', 'Scan Bin').then(function(yes){
            if(yes==false)
            {
              svc.inputBinLocationCode();
            }
          });
      }
      else
      {
          svc.alertService.doAlertWithtimeOut(res.result.statusMsg, '', 2000).then(function(yes)
          {
            svc.bValidateProductCode = true;
            svc.labelOfScanBarcode = 'Scan Label:';
          });
      }
    });
  } 
  else
  {
    svc.user.p2linfo.p2lBarcode = val;
    svc.callConfirmQty();
  }

}

  timerTick()
  {
    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="P2lScanProductPage"  || this.mobileAppSystem.isBusy()==true)
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

    if(this.bValidateProductCode==false)
      return;

    let svc = this;
    this.confirmedPick = '';
    this.confirmedPickFocused = true;    

    CustomKeyBoard.show();
    CustomKeyBoard.setTarget(this.confirmInput, function(val:string){
      svc.confirmedPick = val;
      svc.confirmedPickFocused = false;
      if(Number(svc.confirmedPick) != svc.productInfo.pickQty)
      {
        svc.callConfirmQty();
      }

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
    
  updateImageUrl(event:any)
  {
    //this.imageUrl = this.productInfo.img_url;
  }    
}
