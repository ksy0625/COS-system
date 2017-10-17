import { AppState } from './app.global';
import { Component, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Platform, Nav, Config, MenuController, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core'
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import {AlertService} from '../providers/alert.service'
import { CustomKeyBoard } from '../components/customKeyBoard/custom-keyboard';


export interface PageInterface {
  title: string;
  component: any;
  active: boolean;
  logsOut?: boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = 'LoginPage';
  keysTab: string[];

  @ViewChild(Nav) nav: Nav;

  beforeScanPages: PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'About', component: 'AboutPage', active: false},
    { title: 'Logout', component: 'LoginPage', active: false, logsOut: true}
  ];

  ScanedPages : PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'Scan Order Barcode', component: 'ScanOrderPage', active: true},
    { title: 'Scan Product Barcode', component: 'ScanProductPage', active: true},
    { title: 'Place in Tote', component: 'PlaceInTotePage', active: true},
    { title: 'Order Pick Status', component: 'OrderStatusPage', active: true},
    { title: 'About', component: 'AboutPage', active: false},
    { title: 'Logout', component: 'LoginPage', active: false, logsOut: true}
  ];
  constructor(
    public events: Events,
    public translate: TranslateService, 
    private platform: Platform, 
    private config: Config, 
    private keyboard: Keyboard, 
    public menu: MenuController,
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private alertService:AlertService,
    private screenOrientation: ScreenOrientation) {

    this.initTranslate();    
    this.listenToEvents();

    // Keyboard key tab (used in the app.html template)
    this.keysTab = [ "1", "2", "3", "4", "5", "6","7", "8", "9","0",
                     "A", "B", "C", "D", "E", "F","",  "", "", "GO"];

    this.keyboard.disableScroll(true);
  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    if (page.logsOut === true) {
        this.events.publish('user:logout');
    }
  }

  enableMenu(scaned: boolean) {
    this.menu.enable(!scaned, 'beforeScanOrderMenu');
    this.menu.enable(scaned, 'afterScanOrderMenu');
  }

  listenToEvents() {
    this.events.subscribe('scan:order', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  ngOnInit()
  {
    console.log("=============");
    CustomKeyBoard.hide();
  }
  
  // Event emitter
  keyClick(k: string) {
    //console.log('Event emitter - key: ', k);
  }
}
