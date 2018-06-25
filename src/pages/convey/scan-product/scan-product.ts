import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

import {MobileAppSystem} from '../../../providers/mobile.app.system'
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
    orderNumber:string;
    stockCode:string;
    description:string;
    binLocation:string;    
    pickUnit:string;
    pickUnitSensitive:string;
    pickQty:number;    
    img_url:string;
    surplusBins: SurplusBin[];
}


@IonicPage()
@Component({
  selector: 'page-scan-product',
  templateUrl: 'scan-product.html'
})
export class ScanProductPage {
  @ViewChild('barCodeInputBox') barCodeInput;
  @ViewChild('barCodeInputBox1') barCodeInput1;    
  @ViewChild('confirmedInputBox') confirmInput;


  private m_checkFirBin:string = 'N';

  private onceConfirmClicked:boolean = false;
  private productBarCode:string = '';
  private productBarCode1:string = '';  
  private productBarCode1Bk:string = '';  
  private titleDefault :string; 
  private title :string;
  private scanStarted:boolean = false;

  private bBinLocationScaning:boolean = false;
  private productInfo: ProductInfo;
  private productInfoBack: ProductInfo; 
  private confirmedPick :string;
  private confirmedPickFocused :boolean = false;
  private pickUnitSensitive: boolean = false;

  private laneStockItem:string = 'N';
  private completed:string = 'N';  
  private imageUrl:string = '';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,              
              public mobileAppSystem:MobileAppSystem,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {
    this.scanStarted = false;
    this.title = '';
    this.titleDefault = '';
    this.productInfo = new  ProductInfo();
    this.productInfoBack = new  ProductInfo();
    this.confirmedPick = '';

    let svc = this;
    translateService.get('SCANPRODUCT_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
        svc.title = value + " : " + svc.user.orderInfo.countProductScaned + " of " + svc.user.orderInfo.countTotalProducts + " done";
      }
    ); 

    CustomKeyBoard.hide();
    this.timerTick();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }


  openPage() {
    this.scanStarted = false;
    this.onceConfirmClicked = false;
    this.navCtrl.setRoot('PlaceInTotePage');
  }


private setQtyInformation(res:any)
{
    this.scanStarted = true;

    this.user.orderInfo.countProductScaned = res.countProductScanned;
    this.user.orderInfo.countTotalProducts = res.countTotalProducts;
    this.user.orderInfo.binLocations = res.binLocationList;

    this.productInfo.orderNumber = res.orderNumber;
    this.productInfo.binLocation = res.binLocation;
    this.productInfo.description = res.description;
    this.productInfo.img_url =   res.img_url;
    //this.imageUrl = 'http://int.cos.net.au/mobileappimages/'+ res.stockCode + '.jpg';
    this.imageUrl = res.img_url;

    //
    //res.img_url; //   'style="background-image:'  + res.img_url + ';"';
    this.productInfo.pickQty = res.pickQty;
    this.productInfo.pickUnit = res.pickUnit;
    this.productInfo.pickUnitSensitive = res.pickUnitSensitive;

    if(res.go2orderpage != null)
    // if(res.pickUnitSensitive =='Y')
    //   this.pickUnitSensitive = true;
    // else
      this.pickUnitSensitive = false;

    this.productInfo.stockCode = res.stockCode;
    this.productInfo.surplusBins = res.surplusBins;

    this.confirmedPick = String(this.productInfo.pickQty);
    this.title = this.titleDefault + " : " + this.user.orderInfo.countProductScaned + " of " + this.user.orderInfo.countTotalProducts + " done";

    this.onceConfirmClicked = false;
    this.clearBarcodeScan();  
}

private updateProductConfirmQty(confirmedQty:number)
{
  let svc = this;
  let orderCompleted:boolean = false;

  this.mobileAppSystem.updateProductConfirmQty(this.productInfo.orderNumber, this.productInfo.stockCode,
    this.productInfo.binLocation, confirmedQty, this.user.orderInfo.toteNumber, this.user.orderInfo.zone, function(res:any){

      if(res!=null && res.result!=null)
      {
        svc.user.orderInfo.binLocations = res.result.binLocationList;
        svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
        svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
        svc.title = svc.titleDefault + " : " + svc.user.orderInfo.countProductScaned + " of " + svc.user.orderInfo.countTotalProducts + " done";

        if(res.result.statusCode != 200)
        {
          svc.alertService.doAlert('Error', res.result.statusMsg, 'OK');
          return;
        }
        else if(res.result.orderComplete == 'Y')
        {
          orderCompleted = true; 
          svc.navCtrl.setRoot('PlaceInTotePage');
          return;
        }
      }

     svc.mobileAppSystem.checkProductNotInToteLimit(svc.user.orderInfo.orderBarcode, svc.user.allowableProductsNotInTote,
       function(res:any){
          if(res==null || res.result==null)return;
    // confirmProductQty
    // if(res.go2ScanOrderPage == 'Y')
    // {
    //   this.navCtrl.setRoot('ScanOrderPage');
    // }

          if(res.result.overLimit=='Y')
          {
            svc.alertService.doConfirm('Your OverLoaded!', res.result.statusMsg, 'YES', 'NO').then(function(yes)
              {
                if(yes)
                {
                   svc.navCtrl.setRoot('PlaceInTotePage');                   
                }
            });
          }
          else
          {
              svc.scanStarted = false;
          }
       });

    });
}

private inputBinLocationCode(confirmAcked:string, statusMsg:string, firstPage:boolean)
{
    let svc = this;
    this.bBinLocationScaning = true;
    let strMsg = 'Product Barcode Not Found!';
    if(statusMsg!='')
      strMsg = statusMsg;

    this.modalService.doPromptRightSide('Scan or Enter Bin Location', strMsg, 'Go', 'Cancel','', 'BinLocation').then(function(binLocationCode)
    {
        svc.bBinLocationScaning = false;
        if(binLocationCode == '')
        {
            svc.m_checkFirBin='N';
            return;
        }      
        if(firstPage)
          svc.checkProductBinBarcode(binLocationCode);
        else
        {
          svc.productBarCode = binLocationCode;
          svc.startScanBarcode1(confirmAcked);
        }
    });
}

private inputBarCodeOnPopup(strMsg:string, strAck:string)
{
    let svc = this;
    this.bBinLocationScaning = true;
    this.modalService.doPromptRightSide('Scan or Enter Barcode', strMsg, 'Go', 'Cancel','', 'Barcode').then(function(barCode)
    {
        svc.bBinLocationScaning = false;
        if(barCode == '')
            return;
        svc.productBarCode = barCode;
        svc.startScanBarcode1(strAck);
    });
}


private checkProductBinBarcode(binBarcode:string){
    let svc = this;    
    this.mobileAppSystem.getProductInfoBinBarcode(binBarcode, this.user.orderInfo.orderBarcode,
      this.user.orderInfo.toteNumber, this.user.orderInfo.warehouse, this.user.orderInfo.zone, function(res:any){
          svc.clearBarcodeScan();
          if(res.isError)
          {   
              svc.inputBinLocationCode('N', '', true);            
              return;
          }
          else
          {
            if(res.result.statusCode==200)  
            {
              svc.setQtyInformation(res.result);
            }
            else
            {
              if(svc.m_checkFirBin!='Y')
              {                
                svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(){
                });
              } 
              else
              {         
                svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Scan Bin Barcode').then(function(ret:boolean){
                  if(ret == false)
                    svc.inputBinLocationCode('N', '', true);
                });
              }
            }
          }
    });     
  }


private checkProductBarcode(productBarcode:string){
    let svc = this;    
    this.mobileAppSystem.getProductInfoProductBarcode(productBarcode, this.user.orderInfo.orderBarcode,
      this.user.orderInfo.toteNumber, this.user.orderInfo.warehouse, this.user.orderInfo.zone, function(res:any){
          svc.clearBarcodeScan();
          if(res.isError)
          {              
              svc.inputBinLocationCode('N', '', true);
              return;
          }
          else
          {           

            if(res.result.statusCode==200)  
            {
              if(res.result.reloadPage=='Y')
              {
                svc.mobileAppSystem.scanOrderBarcode(res.result.orderBarcode, svc.user.sessionInfo.userWarehouse,svc.user.orderInfo.zone, function(res:any)
                {
                  if(res==null)return;
                  if(res.result.binLocationList == null)
                  {
                    if(res.result.statusMsg != null && res.result.statusMsg != '')
                      // svc.modalService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK', 'default', 'barcode');
                      svc.alertService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK');                      
                    return;
                  }
                  svc.user.orderInfo.binLocations = res.result.binLocationList;
                  svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
                  svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
                  svc.user.orderInfo.orderBarcode = res.result.orderNumber;
                  svc.user.orderInfo.toteNumber = res.result.toteNumber;
                  svc.user.orderInfo.warehouse = svc.user.sessionInfo.userWarehouse;
                  svc.scanStarted = false;
                  svc.navCtrl.setRoot('ScanProductPage');
                });
                return;                
              }


              if(res.result.go2ScanOrderPage=='Y') 
              {
                svc.navCtrl.setRoot('ScanOrderPage');
              }
              else
                svc.setQtyInformation(res.result);
            }
            else
            {
              svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Scan Bin Barcode').then(function(ret:boolean){
                if(ret == false)
                  svc.inputBinLocationCode('N', '', true);
              });
            }
          }
    });     

  }

  startScanBarcode(){
   if(this.productBarCode =='')
     return;

   this.scanStarted=false;

   let productBarcode = this.productBarCode;
   this.productBarCode1Bk = productBarcode;
   this.checkProductBarcode(productBarcode);
  }


  firstScan()
  {    
    this.onChangedProductBarCode(this.productBarCode);
    CustomKeyBoard.hide();
  }
  onChangedProductBarCode(val:any)
  {
    if(this.scanStarted==true)
      return;    
    if(val =='')return;
    this.startScanBarcode();    
  }


  // startScanBarcode1(ackStr:string)
  // {
  //   let svc = this;    
  //   this.productInfoBack = this.productInfo;

  //   this.mobileAppSystem.confirmProductQty(this.user.orderInfo.orderBarcode,
  //     this.productInfo.stockCode, this.productInfo.binLocation, Number(this.confirmedPick),  this.productBarCode, this.user.orderInfo.zone, 
  //     this.user.hasTotes, ackStr,  function(res:any){
  //         svc.clearBarcodeScan();
  //       if(res.result.statusCode==200)  
  //       {
  //         if (res.result.orderNumber==null) 
  //         {
  //           if(res.result.go2ScanOrderPage=='Y')
  //           {
  //              svc.navCtrl.setRoot('ScanOrderPage');
  //              return;
  //           }
  //           else
  //           {
  //             let confirmedPick:Number =  Number(svc.confirmedPick);

  //             if(svc.productInfoBack.pickQty < confirmedPick)  
  //             {
  //                svc.alertService.doAlert('Invalid Qty!', '', 'OK').then(function(){                   
  //                });
  //             }
  //             else if(svc.productInfoBack.pickQty > confirmedPick)
  //             {
  //               let data={productInfo: svc.productInfoBack, entered:confirmedPick};
  //               svc.modalService.showConfirmModal('ConfirmQtyPage', 'inset-modal_2', data).then(function(yes){
  //                 if(yes==1)
  //                 {
  //                   svc.productBarCode = svc.productBarCode1Bk;
  //                   svc.productInfo = svc.productInfoBack;
  //                   svc.startScanBarcode1('Y');
  //                 }
  //                 else
  //                   svc.confirmedPick = String(svc.productInfo.pickQty);
  //               });
  //             }             

  //           }
  //         }
  //         else
  //         {
  //           svc.setQtyInformation(res.result);
  //         }
  //       }
  //       else if(res.result.statusCode==400)
  //       {
  //         svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean){
  //         });
  //       }
  //   });     
  // }

startScanBarcode1(ackStr:string)
  {
    let svc = this;    
    this.productInfoBack = this.productInfo;
    let confirmedPick:Number =  Number(svc.confirmedPick);

    this.mobileAppSystem.confirmProductQty(this.user.orderInfo.orderBarcode,
      this.productInfo.stockCode, this.productInfo.binLocation, Number(this.confirmedPick),  this.productBarCode, this.user.orderInfo.zone, 
      this.user.hasTotes, ackStr,  this.m_checkFirBin, svc.laneStockItem, function(res:any){
          svc.clearBarcodeScan();
        if(res==null || res.result==null)  
          return;

        svc.m_checkFirBin = res.result.checkForBin;
        
        if(res.result.statusCode==200)  
        {
           svc.laneStockItem = res.result.laneStockItem;           
           // svc.completed = res.result.completed;

           // if(svc.completed =='Y')
           // {
           //   svc.alertService.doAlertWithtimeOut('', res.result.statusMsg, 3000).then(function(yes){
           //   });
           //   return;
           // }
            if(res.result.go2ScanOrderPage == 'Y')
            {
              svc.navCtrl.setRoot('ScanOrderPage');
              return;
            } 


           if(res.result.go2ProductBarcodePage=='Y')
           {
              // svc.mobileAppSystem.scanOrderBarcode(res.result.orderBarcode, svc.user.sessionInfo.userWarehouse,svc.user.orderInfo.zone, function(res:any){
              //   if(res==null)return;
              //   if(res.result.binLocationList == null)
              //   {
              //     if(res.result.statusMsg != null && res.result.statusMsg != '')
              //       // svc.modalService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK', 'default', 'barcode');
              //     svc.alertService.doAlert('ScanOrderBarcode', res.result.statusMsg, 'OK');        
              //     return;
              //   }
              svc.user.orderInfo.binLocations = res.result.binLocationList;
              svc.user.orderInfo.countProductScaned = res.result.countProductScanned;
              svc.user.orderInfo.countTotalProducts = res.result.countTotalProducts;
              svc.user.orderInfo.orderBarcode = res.result.orderNumber;
              svc.user.orderInfo.toteNumber = res.result.toteNumber;
              svc.user.orderInfo.warehouse = svc.user.sessionInfo.userWarehouse;
              //});
              svc.scanStarted = false;
              svc.navCtrl.setRoot('ScanProductPage');
              return;
           }


           if(svc.laneStockItem =='Y')
           {
             svc.alertService.doAlertWithtimeOut('', res.result.statusMsg, 2000).then(function(yes){
                if (res.result.orderNumber==null) 
                {
                  if(res.result.go2ScanOrderPage=='Y')
                  {
                     svc.navCtrl.setRoot('ScanOrderPage');
                     return;
                  }
                }
                else
                {            
                  svc.setQtyInformation(res.result);
                }
             });
           }
           else
           {
            if (res.result.orderNumber==null) 
            {
              if(res.result.go2ScanOrderPage=='Y')
              {
                 svc.navCtrl.setRoot('ScanOrderPage');
                 return;
              }
            }
            else
            {            
              svc.setQtyInformation(res.result);
            }
          }
        }
        else //if(res.result.statusCode==400)
        {
          if(res.result.outdatedTote=='Y')
          {
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean){
            });                  
          }
          else
          {
            if(svc.m_checkFirBin!='Y')
            {
                svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(){
                });                
            }
            else
              svc.inputBinLocationCode(ackStr, res.result.statusMsg, false);
          } 
        }

    });
  }


  onChangedProductBarCode1(val:any)
  {
    if(this.scanStarted==false)
      return;    

    if(this.productInfo.pickUnitSensitive =='Y' && this.pickUnitSensitive==false)
      return;

    if(val =='')return;
    this.productBarCode =  val;
    this.productBarCode1Bk = val;
    this.startScanBarcode1('N');
  }


  clearBarcodeScan()
  {
    this.productBarCode = '';    
    this.productBarCode1 = '';    
  }  

  timerTick()
  {
    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="ScanProductPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      let visibleKeypad = CustomKeyBoard.isVisible();            

      if(svc.scanStarted ==false)
      {
        if(svc.bBinLocationScaning ==false)
        {

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
        }

      }
      else
      {
        if(svc.bBinLocationScaning ==false)
        {
            if (svc.platform.is('cordova'))
             svc.keyboard.close();

           if(svc.confirmedPickFocused ==false)
           {
             if(visibleKeypad==false )
             {
               if(svc.barCodeInput1._isFocus ==false)
               {
                 svc.barCodeInput1._readonly = true;
                 svc.barCodeInput1.setFocus();
                 setTimeout(() =>{
                  svc.barCodeInput1._readonly = false;
                 }, 40);
               }               
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
      if(this.scanStarted==false)
      {
        CustomKeyBoard.setTarget(this.barCodeInput, function(val:string){
          svc.onChangedProductBarCode(val);
        });
      }
      else        
      {
        CustomKeyBoard.setTarget(this.barCodeInput1, function(val:string){
          svc.onChangedProductBarCode1(val);
        });
      }
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
          svc.confirmedPickFocused = false;
          svc.onChangeConfirmQty();
    });
  }  

  onClickBarcode1()
  {
    if(this.confirmedPickFocused ==true)
    {
      CustomKeyBoard.hide();
      this.confirmedPickFocused = false;
    }
  }

  onChangeConfirmQty()
  {
    let svc = this;
    svc.confirmedPickFocused = false;

    if(this.confirmedPick =='')   
      return;

    if(this.productInfo.stockCode =='')
      return;
    if(this.productInfo.pickUnitSensitive=='Y' && this.pickUnitSensitive==false)
      return;

    let confirmQty:number = Number(this.confirmedPick);
    if(confirmQty > this.productInfo.pickQty)
    {
       this.alertService.doAlert('Invalid Qty!', '', 'OK');
    }
    else if(confirmQty < this.productInfo.pickQty)
    {
      let data={productInfo: svc.productInfo, entered:svc.confirmedPick};
      svc.modalService.showConfirmModal('ConfirmQtyPage', 'inset-modal_2', data).then(function(yes){
        if(yes==1)
        {
          svc.mobileAppSystem.confirmChangedProductQty(svc.user.orderInfo.orderBarcode, svc.user.orderInfo.warehouse,
            svc.productInfo.stockCode, svc.productInfo.binLocation, Number(svc.confirmedPick),  svc.user.orderInfo.zone, 
            svc.user.hasTotes, 'N',  svc.laneStockItem, function(res:any){
                svc.clearBarcodeScan();
              if(res.result.statusCode==200)  
              {
                if (res.result.go2ScanOrderPage!=null && res.result.go2ScanOrderPage=='Y') 
                {
                   svc.navCtrl.setRoot('ScanOrderPage');
                   return;
                }
                else
                {
                  svc.inputBarCodeOnPopup(res.result.statusMsg, 'Y');
                }
              }
              else if(res.result.statusCode==400)
              {
                svc.alertService.doAlert('Error', res.result.statusMsg, 'OK').then(function(ret:boolean){
                });                                    
              }
          });
        }
        else
          svc.confirmedPick = String(svc.productInfo.pickQty);
      });
    }
  }

  updateImageUrl(event:any)
  {
    //this.imageUrl = this.productInfo.img_url;
  }
  
  onGotoHome()
  {
    this.navCtrl.setRoot('HomeScreenPage');
  }

  onGotoScanOrder()  
  {
    let svc = this;
    this.mobileAppSystem.checkInToteStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone,function(res:any){
      if(res==null || res.result==null)return;
      if(res.result.itemsNotInToteExist=='Y')
      {        
        svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Cancel').then(function(yes)
        {
          if(yes)
            svc.navCtrl.setRoot('PlaceInTotePage');
        });
      }
      else
      {
        svc.navCtrl.setRoot('ScanOrderPage');
      }
    });    
  }

}
