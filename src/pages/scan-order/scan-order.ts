import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { OrderBarcodeRequest } from '../../providers/api/message'

import { ServiceApi } from '../../providers/api/api';
import {User} from '../../providers/user'

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

  public zoneCodes:string[] = ['zone-1','zone-2'];
  public zoneCode:string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public events: Events, public user:User, public serviceApi:ServiceApi) 
  {
    
    console.log(this.user.sessionId);
    this.serviceApi.initialiseConveyorPick(this.user.warehouse, this.onSuccessInitializeConveyOrPick);
    //let req:OrderBarcodeRequest = {};
    ///get ConveyorPick
    // this.serverApi    

  }

  onSuccessInitializeConveyOrPick(result:any){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanOrderPage');
  }
  openPage() {
    this.events.publish('scan:order');
  	this.navCtrl.push('ScanProductPage');
  }
}
