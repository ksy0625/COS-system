import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AlertService} from '../../providers/alert.service'
/**
 * Generated class for the OrderStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
})
export class OrderStatusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	    private alertService:AlertService
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusPage');
  }

}
