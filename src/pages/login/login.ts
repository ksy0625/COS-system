import { Component} from '@angular/core';
import { AppData } from '../../providers/app';

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

  aboutData:any;

  constructor(public navCtrl: NavController, 
   	public navParams: NavParams,
  	public menu: MenuController,
    public mobileAppSystem: MobileAppSystem,
    private appData:AppData,
    private alertService:AlertService,
    private user:User) 
  {
    this.username = 'testuser';
    this.password = 'testpass123';
  }

  ionViewDidLoad() {
    this.appData.getAppAboutData().subscribe((data: any) => {
        this.aboutData = data;
      });        
    console.log('ionViewDidLoad LoginPage');
    this.navCtrl.popToRoot();
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(false);
  }
  doLogin() {
    let svc = this;
    this.mobileAppSystem.loginOPsApp(this.username, this.password, function(res:any){

      if(res.result.statusCode!=200)
      {
        svc.alertService.doAlert('', res.result.statusMsg, 'OK');
      }
      else
      {        
        svc.user.sessionInfo = res.result.loginResult;
        svc.user.sessionInfo.modules = res.result.modules;
        if(svc.user.sessionInfo.modules==null || svc.user.sessionInfo.modules.length==0 
          || typeof(svc.user.sessionInfo.modules[0])!='string' )
        {
          svc.alertService.doAlert('', 'You do not have access to any app, please contact IT Support', 'OK');
        }
        else
        {
          svc.navCtrl.setRoot('HomeScreenPage').then(() => {
            svc.navCtrl.popToRoot();
          });
        }

      }
    }, true);

  }

}
