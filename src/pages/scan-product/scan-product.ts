import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


import {MobileAppSystem} from '../../providers/mobile.app.system'
import {User} from '../../providers/user'
import {AlertService} from '../../providers/alert.service'
import {ModalService} from '../../providers/modal.service'



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
  templateUrl: 'scan-product.html',
})
export class ScanProductPage {
  private titleDefault :string 
  private title :string 
  private scanStarted:boolean = false;
  private productInfo: ProductInfo;
  private confirmedPick :number;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public mobileAppSystem:MobileAppSystem,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {
    this.scanStarted = false;
    this.title = '';
    this.titleDefault = '';
    this.productInfo = new  ProductInfo();
    this.confirmedPick = 0;

    let svc = this;
    translateService.get('SCANPRODUCT_TITLE').subscribe(
      value => {
        svc.titleDefault = value;
        svc.title = value + " : " + svc.user.orderInfo.countProductScaned + " of " + svc.user.orderInfo.countTotalProducts + " done";
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanProductPage');
  }

  openPage() {
    this.navCtrl.push('PlaceInTotePage');
  }


private setQtyInformation(res:any)
{
    this.user.orderInfo.countProductScaned = res.countProductScanned;
    this.user.orderInfo.countTotalProducts = res.countTotalProducts;
    this.user.orderInfo.binLocations = res.binLocationList;

    this.productInfo.orderNumber = res.orderNumber;
    this.productInfo.binLocation = res.binLocation;
    this.productInfo.description = res.description;
    this.productInfo.img_url = res.img_url;
    this.productInfo.pickQty = res.pickQty;
    this.productInfo.pickUnit = res.pickUnit;
    this.productInfo.pickUnitSensitive = res.pickUnitSensitive;
    this.productInfo.stockCode = res.stockCode;
    this.productInfo.surplusBins = res.surplusBins;

    this.confirmedPick = this.productInfo.pickQty;
    this.updateProductConfirmQty(this.confirmedPick);
}

private updateProductConfirmQty(confirmedQty:number)
{
  this.mobileAppSystem.updateProductConfirmQty(this.productInfo.orderNumber, this.productInfo.stockCode,
    this.productInfo.binLocation, confirmedQty, function(res:any){

    });
}

private inputBinLocationCode()
{
    let svc = this;
    this.alertService.doPrompt ('Product Barcode Not Found!', 
        'Scan or Enter Bin Location', 'YES', 'NO', 'BinLocation').then(function(binLocationCode){
        if(binLocationCode == '')
        {
            svc.inputBinLocationCode();
            return;
        }

        svc.mobileAppSystem.getProductInfoBinBarcode(binLocationCode, svc.user.orderInfo.orderBarcode,
          svc.user.orderInfo.toteNumber, svc.user.orderInfo.warehouse, svc.user.orderInfo.zone, function(res:any){
          if(res==null)
          {
              svc.alertService.doAlert('Bin Location Not Found!', '', 'OK');
              svc.navCtrl.push('PlaceInTotePage');
              return;
          }
          else
          {
              svc.setQtyInformation(res.result);              
          }
        });                  
    });

}

private checkProductBarcode(productBarcode:string){
    let svc = this;    
    this.mobileAppSystem.getProductInfoProductBarcode(productBarcode, this.user.orderInfo.orderBarcode,
      this.user.orderInfo.toteNumber, this.user.orderInfo.warehouse, this.user.orderInfo.zone, function(res:any){
          if(res==null)
          {
              svc.inputBinLocationCode();
              return;
          }
          else
          {
              svc.setQtyInformation(res.result);
          }
    });     

  }

  startScanBarcode(){
   this.scanStarted = true; 
   let productBarcode = '3934237023075';

   let svc = this;
   this.mobileAppSystem.checkProductNotInToteLimit(this.user.orderInfo.orderBarcode, this.user.allowableProductsNotInTote,
     function(res:any){
        if(res==null)return;
        if(res.result.overLimit=='Y')
        {
          svc.alertService.doConfirm('Your OverLoaded!', 
            svc.user.orderInfo.countTotalProducts + ' Products Picked but not scanned into Tote. Do that now?',
            'YES', 'NO').then(function(yes)
            {
              if(yes)
              {
                 svc.navCtrl.push('PlaceInTotePage');
              }
              else
                svc.checkProductBarcode(productBarcode);
          });
        }
        else
          svc.checkProductBarcode(productBarcode);

     });
  }

  onChangeConfirmQty(val:any)
  {    
    let svc = this;
    let data={productInfo: this.productInfo, entered:val};
    this.modalService.showConfirmModal('ConfirmQtyPage', 'inset-modal_2', data).then(function(yes){
      if(yes)
        svc.updateProductConfirmQty(val);
      else
        svc.confirmedPick = svc.productInfo.pickQty;
    });
  }



}
