import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import {User} from '../../providers/user'

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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menu: MenuController,
    public user:User ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeScreenPage');
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(true);
  }

  openPage() {

  	this.navCtrl.push('ScanOrderPage');
  }
}
