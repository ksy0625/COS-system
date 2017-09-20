import { Component} from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

import {MobileAppSystem} from '../../providers/mobile.app.system'
import {User} from '../../providers/user'
import {AlertService} from '../../providers/alert.service'



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
    public mobileAppSystem: MobileAppSystem,
    private alertService:AlertService,
    private user:User) 
  {
    this.username = 'testuser';
    this.password = 'testpass123';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(false);
  }
  doLogin() {
    let svc = this;
    this.mobileAppSystem.loginOPsApp(this.username, this.password, function(res:any){
      svc.user.sessionInfo = res.result.loginResult;      
      svc.navCtrl.setRoot('HomeScreenPage', {}, {animate: true, direction: 'forward'});
    }, true);

  }

}
