import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams , Events} from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import {User} from '../../providers/user'
import {MobileAppSystemP2l} from '../../providers/mobile.app.system.p2l'


/**
 * Generated class for the HomeScreenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-screen',
  templateUrl: 'home-screen.html',
})
export class HomeScreenPage {
//  @ViewChild('input1') input1 ;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public events: Events,
  	public menu: MenuController,
    public mobileAppSystemP2L:MobileAppSystemP2l,
    public user:User ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeScreenPage');

    this.mobileAppSystemP2L.setSessionId(this.user.sessionInfo.sessionId);
    this.mobileAppSystemP2L.deAllocateJob(this.user.sessionInfo.userWarehouse, 1576703);
//    console.log(this.input1);
    this.events.publish('home:entered');    
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(true);
  }

  openConvey() {
  	this.navCtrl.push('ScanOrderPage');   
  }

  openP2Job() {

    this.events.publish('p2ljob:start');
    this.navCtrl.push('P2lOutstandingPage');
  }

  openPage(){

  }


}
