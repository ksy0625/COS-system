
import { Component, ViewChild } from '@angular/core';

import { Platform, Nav, Config, MenuController, Events } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core'

import {User} from '../providers/user'

import {AlertService} from '../providers/alert.service'
import { CustomKeyBoard } from '../components/customKeyBoard/custom-keyboard';
import {MobileAppSystem} from '../providers/mobile.app.system'

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

  menuPages: PageInterface[] =[];

  homePages: PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'About', component: 'AboutPage', active: false},
    { title: 'Logout', component: 'LoginPage', active: false, logsOut: true}
  ];

  ConveyPages : PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'Scan Order Barcode', component: 'ScanOrderPage', active: true},
    { title: 'Scan Product Barcode', component: 'ScanProductPage', active: true},
    // { title: 'Place in Tote', component: 'PlaceInTotePage', active: true},
    { title: 'Order Pick Status', component: 'OrderStatusPage', active: true},
    { title: 'About', component: 'AboutPage', active: false},
    { title: 'Logout', component: 'LoginPage', active: false, logsOut: true}
  ];

  P2LPages : PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'Begin P2L Job', component: 'P2lBeginJobPage', active: true},
    { title: 'Scan Product', component: 'P2lScanProductPage', active: true},    
    { title: 'My Jobs in Progress', component: 'P2lJobInProgressPage', active: true},
    { title: 'About', component: 'AboutPage', active: false},
    { title: 'Logout', component: 'LoginPage', active: false, logsOut: true}
  ];

  LinePages : PageInterface[] = [
    { title: 'Home', component: 'HomeScreenPage', active: true},
    { title: 'Begin 1 Liner Pick Job', component: 'LinePickJobPage', active: true},
    { title: 'Pick Orders', component: 'LinePickOrderPage', active: true},
    { title: 'My 1 Liner Pick Status', component: 'LineJobInProgressPage', active: true},
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
    public user:User,
    public mobileAppSystem: MobileAppSystem
    ) {

    this.menuPages = this.homePages;

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
    let svc = this;

    if(this.user.workingRegion =='convey')
    {
      if(page.component =='ScanOrderPage')
      {
        this.mobileAppSystem.checkInToteStatus(this.user.orderInfo.orderBarcode, this.user.orderInfo.zone,function(res:any){
          if(res==null || res.result==null)return;
          if(res.result.itemsNotInToteExist=='Y')
          {        
            svc.alertService.doConfirm('Error', res.result.statusMsg, 'OK', 'Cancel').then(function(yes)
            {
              if(yes)
                svc.nav.setRoot('PlaceInTotePage');
            });
          }
          else
          {
            svc.nav.setRoot('ScanOrderPage');
          }
        });   
      }
      else
        this.nav.setRoot(page.component);
    }
    else if(this.user.workingRegion =='p2ljob')
    {
      this.nav.setRoot(page.component);
    }
    else
      this.nav.setRoot(page.component);
    
    if (page.logsOut === true) {
        this.events.publish('user:logout');
    }
    
  }

  enableMenu() {
    if(this.user.workingRegion =='')
      this.menuPages = this.homePages;
    else if(this.user.workingRegion =='convey')
      this.menuPages = this.ConveyPages;
    else if(this.user.workingRegion =='p2ljob')    
      this.menuPages = this.P2LPages;
    else if(this.user.workingRegion =='1line')
      this.menuPages = this.LinePages;
  }

  listenToEvents() {

    this.events.subscribe('home:entered', () => {
      this.user.workingRegion = '';
      this.enableMenu();
    });

    this.events.subscribe('convey:startscan', () => {
      this.user.workingRegion = 'convey';
      this.enableMenu();
    });

    this.events.subscribe('p2ljob:start', () => {
      this.user.workingRegion = 'p2ljob';
      this.enableMenu();
    });

    this.events.subscribe('1line:start', () => {
      this.user.workingRegion = '1line';
      this.enableMenu();
    });    

    this.events.subscribe('user:logout', () => {
      this.user.workingRegion = '';
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
