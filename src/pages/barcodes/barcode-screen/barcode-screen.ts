import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import {MobileAppSystemBarcodes} from '../../../providers/mobile.app.system.barcodes'
import {User,BarcodeBarcodes} from '../../../providers/user'
import {AlertService} from '../../../providers/alert.service'
import {ModalService} from '../../../providers/modal.service'
import { CustomKeyBoard } from '../../../components/customKeyBoard/custom-keyboard';

/**
 * Generated class for the ScanProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-barcode-screen',
  templateUrl: 'barcode-screen.html'
})
export class BarcodeScreenPage{

  @ViewChild('cartonBarcodeInputBox') cartonBarcodeInput;
  @ViewChild('packBarcodeInputBox')   packBarcodeInput;
  @ViewChild('palletBarcodeInputBox') palletBarcodeInput;
  @ViewChild('pieceBarcodeInputBox')  pieceBarcodeInput;

  cartonBarcode:string='';
  packBarcode:string='';
  palletBarcode:string='';
  pieceBarcode:string='';

  barCodes:BarcodeBarcodes; 
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keyboard:Keyboard,
              private platform: Platform,
              public mobileAppSystem:MobileAppSystemBarcodes,
              private modalService:ModalService,
              public translateService:TranslateService, public user:User, private alertService:AlertService) {

    this.barCodes = this.user.barcodeInfo.barcodes;
    CustomKeyBoard.hide();
    this.timerTick();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodeScreenPage');
  }


  timerTick()
  {
    let svc = this;
    setTimeout(() => {

      if(this.navCtrl.getActive().id !="BarcodeScreenPage"  || this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }

      if (svc.platform.is('cordova'))        
        svc.keyboard.close();
      svc.timerTick();
      
    },100); //a least 150ms.

  }

  onShowKeyPad0()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(svc.pieceBarcodeInput, function(val:string){
      });
    }
  }
  onShowKeyPad1()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(svc.packBarcodeInput, function(val:string){
      });
    }
  }
  onShowKeyPad2()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(svc.cartonBarcodeInput, function(val:string){
      });
    }
  }
  onShowKeyPad3()
  {
    let svc = this;
    if(CustomKeyBoard.isVisible())
       CustomKeyBoard.hide();
    else
    {
      CustomKeyBoard.show();    
      CustomKeyBoard.setTarget(svc.palletBarcodeInput, function(val:string){
      });
    }
  }



  hideKeyboard()
  {    
    CustomKeyBoard.hide();
  }

  onClickPieceBarcode()
  {
  }
  onClickPackBarcode()
  {
  }
  onClickCartonBarcode()
  {    
  }
  onClickPalletBarcode()
  {
  }


  openPage()
  {
    if(this.cartonBarcode=='' && this.packBarcode=='' && this.palletBarcode=='' && this.pieceBarcode=='')
      return;

    let svc = this;
    this.mobileAppSystem.UpdateStockBarcodes('', this.barCodes.stockCode, 
      this.pieceBarcode, this.packBarcode, this.cartonBarcode, this.palletBarcode, function(res:any){

      if(res==null)return;
      if(res.status!=200)
      {
        if(res.statusMsg != null && res.statusMsg != '')
          svc.alertService.doAlert('ScanOrderBarcode', res.statusMsg, 'OK');
        return;
      }

      svc.alertService.doAlert('Barcodes updated Successfully', '', 'OK').then(function(res:any){
        svc.navCtrl.setRoot('BarcodeScanBinPage');
      });

    });    
  }

  updateImageUrl(event:any)
  {
    // this.imageUrl = this.putawayLineDetail.image;
  }        
    
}
