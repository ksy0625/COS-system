import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import {MobileAppSystem} from '../../../providers/mobile.app.system'
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

export class Product{
	rowId:number;
	binLocation:string;
	stockCode:string;
}

export class ProductOrder extends Product{
	pickQty:number;
	confirmQty:number;
}


@IonicPage()
@Component({
  selector: 'page-place-in-tote',
  templateUrl: 'place-in-tote.html',
})
export class PlaceInTotePage {

  @ViewChild('toteBarCodeInputBox') toteBarCodeInput ;

  productOrderList:ProductOrder[] = [];
  toteBarcode:string = '';  
  didUnload:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
          private platform: Platform,
  			  public mobileAppSystem:MobileAppSystem,
          private keyboard:Keyboard,
  	    	private alertService:AlertService, 
  			  public user:User) {
    
    //user.hasTotes = 'Y';
    if(this.user.orderInfo.toteNumber)
  	  this.toteBarcode = this.user.orderInfo.toteNumber;
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacInTotePage');
    let svc = this;
    this.mobileAppSystem.getProductListNotInTote(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function(res:any){
    	if(res!=null)
    		svc.productOrderList = res.result.productList;
    	
    	svc.selectToteBarcodeInput();
    });
  }

  ionViewWillEnter()
  {
    this.didUnload = false;
    CustomKeyBoard.hide();
    this.timerTick();
  }  

  ionViewWillLeave()
  {
    this.productOrderList = [];
    this.didUnload = true;
  }   

  openPage() {

    let toteBarcode:string = '00000000';

    if(this.user.hasTotes == 'Y')
    {
  	  if(this.toteBarcode=='')
        return;
      else
        toteBarcode = this.toteBarcode;
    }

  	let svc = this;
  	let productList: Product[] = [];

  	if(this.productOrderList != null)
  	{
		for(var productOrder of this.productOrderList) {
			productList.push({rowId: productOrder.rowId, binLocation: productOrder.binLocation, stockCode: productOrder.stockCode});
		}  		
  	}

  	//let productList;
  	this.mobileAppSystem.placeInTote(this.user.orderInfo.orderBarcode, 
  		toteBarcode, this.user.orderInfo.zone, productList, function(res:any){
  		if(res==null || res.result==null)
  			return;

  		if(res.result.orderComplete == 'Y')
  		{
          svc.alertService.doAlertWithtimeOut('Order Complete!', '', 2000).then(function(res:any){
            svc.navCtrl.setRoot('ScanOrderPage');
          });
  		}
  		else if(res.result.orderComplete == 'N')
  		{
       
        if(res.result.statusMsg !='')
        {
          if(res.result.statusCode==200)
          {
            svc.alertService.doAlertWithtimeOut('Success', res.result.statusMsg, 2000).then(function(res:any){
                svc.navCtrl.setRoot("ScanProductPage");
            });
          }
          else
          {
            if(svc.user.hasTotes == 'Y')
              svc.toteBarcode = '';
            svc.alertService.doAlertWithtimeOut('Error', res.result.statusMsg, 2000).then(function(res:any){
            });
          }
        }
  		}
  	});

  }


  private allocateNewToteToOrder()
  {
  	if(this.toteBarcode=='')return;

  	let svc = this;
  	let productList: Product[] = [];

	for(var productOrder of this.productOrderList) {
		productList.push({rowId: productOrder.rowId, binLocation: productOrder.binLocation, stockCode: productOrder.stockCode});
	}

  	//let productList;
	this.mobileAppSystem.allocateNewToteToOrder(this.user.orderInfo.orderBarcode, 
		this.toteBarcode, this.user.orderInfo.zone, productList, function(res:any){
		if(res==null)return;
		if(res.result==null)return;
			
      if(res.result.orderComplete == 'Y')
      {
          svc.alertService.doAlert('Order Complete!', '', 'OK').then(function(res:any){          
            svc.navCtrl.setRoot('ScanOrderPage');
          });    
      }
      else if(res.result.orderComplete == 'N')
      {
       
        if(res.result.statusMsg !='')
        {
          if(res.result.statusCode==200)
          {
            svc.alertService.doAlert('Success', res.result.statusMsg, 'OK').then(function(res:any){
              svc.navCtrl.setRoot("ScanProductPage");
            });            
          }
          else
            svc.alertService.doAlert('Error', res.result.statusMsg, 'OK');
        }
      }
	});  	
  }


  selectToteBarcodeInput()
  {
    setTimeout(() => {
      this.toteBarCodeInput.setFocus();
    },500); //a least 150ms.
  }
  onChangedToteBarcode(val:any)
  {    
   
    if(val==null || val=='')
      return;
    this.openPage();
  }


  timerTick()
  {
    if(this.didUnload)return;
    
    let svc = this;
    setTimeout(() => {
      if(this.navCtrl.getActive().id !="PlaceInTotePage" ||  this.mobileAppSystem.isBusy()==true)
      {
        this.timerTick();
        return;
      }  

      if (this.platform.is('cordova'))
        this.keyboard.close();

      if(this.toteBarCodeInput._isFocus ==false)          
      {
         this.toteBarCodeInput._readonly = true;
         this.toteBarCodeInput.setFocus(); 
         setTimeout(() =>{
           svc.toteBarCodeInput._readonly = false;
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
      CustomKeyBoard.setTarget(this.toteBarCodeInput, function(val:string){
        svc.onChangedToteBarcode(val);
      });      
    }
  }

  onGotoHome()
  {
    this.navCtrl.setRoot('HomeScreenPage');
  }  
  
}
