import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlertService} from '../../providers/alert.service'
import {MobileAppSystem} from '../../providers/mobile.app.system'
import {User} from '../../providers/user'

/**
 * Generated class for the OrderStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export class OrderedProduct{
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

  orderedProducts: OrderedProduct[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  		public mobileAppSystem:MobileAppSystem,
  	    private alertService:AlertService,
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

}
