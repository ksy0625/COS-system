import { AppData } from '../../providers/app';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  
  aboutData: any;
  constructor(
  	public appData: AppData,
  	public navCtrl: NavController, 
  	public navParams: NavParams) {
  	appData.load();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
	this.appData.getAppAboutData().subscribe((data: any) => {
  		this.aboutData = data;
  	})    
  }
}
