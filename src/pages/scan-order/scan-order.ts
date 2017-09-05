import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the ScanOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-order',
  templateUrl: 'scan-order.html',
})
export class ScanOrderPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanOrderPage');
  }
  openPage() {
    this.events.publish('scan:order');
  	this.navCtrl.push('ScanProductPage');
  }
}
