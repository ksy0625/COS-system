import { Component} from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

import {LoginService} from '../../providers/login/login'
import {AlertService} from '../../providers/util/alert.service'
import {User} from '../../providers/user'


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage{
  isReadyToSave: boolean;  
  username:string; 
  password:string; 

  constructor(public navCtrl: NavController, 
   	public navParams: NavParams,
  	public menu: MenuController,
    public loginService: LoginService,
    private alertApi: AlertService,
    private user:User) 
  {
    this.username = 'testuser';
    this.password = 'LoginMobile';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(false);
  }
  doLogin() {
    this.loginService.login(this.username, this.password, this.onLoginSucced, true);
  }

  onLoginSucced(res:any){
      this.navCtrl.setRoot('HomeScreenPage', {}, {animate: true, direction: 'forward'});
  }
}
