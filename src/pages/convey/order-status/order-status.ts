import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlertService} from '../../../providers/alert.service'
import {MobileAppSystem} from '../../../providers/mobile.app.system'
import {User} from '../../../providers/user'

/**
 * Generated class for the OrderStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export class OrderedProduct{
  orderNumber:string;
	binLocation:string;
	confirmQty:number;
	pickQty:number;
	status:string;
	stockCode:string;
}



@IonicPage()
@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
})
export class OrderStatusPage {

  selectedIndex:number = -1;

  orderedProducts: OrderedProduct[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  		public mobileAppSystem:MobileAppSystem,
      
  	    public user:User
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusPage');

    let svc = this;
	this.mobileAppSystem.getOrderPickStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone, function(res:any){
		if(res==null)return;
		if(res.result==null)return;		
		svc.orderedProducts = res.result.productList;
	});
  }


  onGotoHome()
  {
    this.navCtrl.setRoot('HomeScreenPage');
  }  
  onGotoScanOrder()
  {
    this.navCtrl.setRoot('ScanOrderPage');
  }

  onSelectOrder(index:number)
  {
    this.selectedIndex = index;   
  }

  onContinue()
  {
    if(this.selectedIndex < 0)
      return;

    this.user.orderInfo.orderBarcode = this.orderedProducts[this.selectedIndex].orderNumber;
    this.selectedIndex = -1;

    this.navCtrl.setRoot('ScanProductPage');
  }

}
