import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import {MobileAppSystem} from '../../providers/mobile.app.system'
import {User} from '../../providers/user'
import {ModalService} from '../../providers/modal.service'
import {AlertService} from '../../providers/alert.service'

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
  toteBarcode:string;  

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			  public mobileAppSystem:MobileAppSystem,
  	    	private modalService:ModalService,
  	    	private alertService:AlertService, 
  			  public user:User) {
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

  openPage() {
  	if(this.toteBarcode=='')return;

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
		this.toteBarcode, this.user.orderInfo.zone, productList, function(res:any){
		if(res==null)
			return;

		if(res.result.orderComplete == 'Y')
		{
			svc.onOrderComplete();
		}
		else if(res.result.orderComplete == 'N')
		{
			svc.alertService.doConfirm('Error', res.result.statusMsg, 'YES', 'NO').then(function(yes:any){
			// svc.al.doConfirm('Error', res.result.statusMsg, 'YES', 'NO', null).then(function(yes:any){
				if(yes==true)
				{
					svc.allocateNewToteToOrder();	
				}
			});	
		}
	});
  	//this.navCtrl.push('OrderStatusPage');
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
			svc.onOrderComplete();
		}
		else if(res.result.orderComplete == 'N')
		{
			//svc.onOrderComplete();
			svc.navCtrl.push('ScanProductPage');
		}
	});  	
  }

  private onOrderComplete()
  {

  	this.alertService.doAlert('Order Complete!', '', 'OK');  	
	//this.modalService.doAlert('Order Complete!', '', 'OK',  'secondary', 'checkmark-circle');
	this.navCtrl.push('OrderStatusPage');
  } 

  selectToteBarcodeInput()
  {
    setTimeout(() => {
      this.toteBarCodeInput.setFocus();
    },500); //a least 150ms.
  }
  onChangedToteBarcode(val:any)
  {    
    let svc = this;
    if(val==null || val=='')
      return;
    this.openPage();
  }


}
