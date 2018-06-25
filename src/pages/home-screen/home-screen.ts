import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Events} from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import {User} from '../../providers/user'
import {MobileAppSystem} from '../../providers/mobile.app.system'
import {MobileAppSystemP2l} from '../../providers/mobile.app.system.p2l'
import {MobileAppSystemMoveStock} from '../../providers/mobile.app.system.movestock'
import {MobileAppSystem1Line} from '../../providers/mobile.app.system.1line'
import {MobileAppSystemPutAway} from '../../providers/mobile.app.system.putaway'
import {MobileAppSystemBinInfo} from '../../providers/mobile.app.system.bin'
import {MobileAppSystemBarcodes} from '../../providers/mobile.app.system.barcodes'


/**
 * Generated class for the HomeScreenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


export class module{
  alias:string='';
  title:string='';  
}

export class row_def{
  modules:module[] = [];
}


@IonicPage()
@Component({
  selector: 'page-home-screen',
  templateUrl: 'home-screen.html',
})

export class HomeScreenPage {

  private rows:row_def[]= [];
//  @ViewChild('input1') input1 ;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public events: Events,
  	public menu: MenuController,
    public mobileAppSystem:MobileAppSystem,
    public mobileAppSystemP2L:MobileAppSystemP2l,
    public mobileAppSystem1Line:MobileAppSystem1Line,
    public mobileAppSystemMoveStock:MobileAppSystemMoveStock,
    public mobileAppSystemPutAway:MobileAppSystemPutAway,
    public mobileAppSystemBinInfo:MobileAppSystemBinInfo,   
    public mobileAppSystemBarcodes:MobileAppSystemBarcodes, 
    public user:User ) 
  {

//  "BARCODES_BUTTON": "Barcodes",  

    let titles = {'binfo':'Bin Info', 
              'convpick':'Conveyor Pick', 
              'movstk':'Move Stock', 
              'p2l':'P2L Bulk', 
              'putway':'Put-Away', 
              'sinlin':'1 Liner  Pick'};

    let row:row_def = new row_def();
    let index:number = 0;

    let modules:string[] = [];
    if(this.user.sessionInfo.modules.indexOf('all') >=0 || 
      this.user.sessionInfo.modules.indexOf(' all')>=0 || 
      this.user.sessionInfo.modules.indexOf('all ')>=0 ||
      this.user.sessionInfo.modules.indexOf(' all ')>=0)
    {
      modules.push('binfo','convpick', 'movstk', 'p2l', 'putway', 'sinlin');
    }
    else
     modules =  this.user.sessionInfo.modules;

     console.log(modules);

    for(let alias of modules)
    {
      let newModule:module = new module();

      alias = alias.trim();
      newModule.alias = alias;
      newModule.title = titles[alias];

      //console.log(newModule.alias, newModule.title);

      row.modules.push(newModule);
      index++;
      if(index % 3==0)
      {
        this.rows.push(row);
        row = new row_def();
      }
    }

    if(row.modules.length > 0)
    {
      if(row.modules.length < 3)
      {
        for(let i=0; i<3-row.modules.length; i++)
        {
          let newModule:module = new module();
          newModule.alias = '';
          newModule.title = '';
          row.modules.push(newModule);
        }
      }      
      this.rows.push(row);
    }

    //console.log(this.rows);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeScreenPage');
    
    this.mobileAppSystemP2L.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystemP2L.setBaseUrl(this.mobileAppSystem.getBaseUrl());

    this.mobileAppSystem1Line.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystem1Line.setBaseUrl(this.mobileAppSystem.getBaseUrl());

    this.mobileAppSystemMoveStock.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystemMoveStock.setBaseUrl(this.mobileAppSystem.getBaseUrl());    

    this.mobileAppSystemPutAway.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystemPutAway.setBaseUrl(this.mobileAppSystem.getBaseUrl());    

    this.mobileAppSystemBinInfo.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystemBinInfo.setBaseUrl(this.mobileAppSystem.getBaseUrl());    

    this.mobileAppSystemBarcodes.setSessionId(this.user.sessionInfo.sessionId); 
    this.mobileAppSystemBarcodes.setBaseUrl(this.mobileAppSystem.getBaseUrlNewScheme() + 'ops/Barcodes/');
      
    //for test . init.    
    //this.mobileAppSystemP2L.deAllocateJob(this.user.sessionInfo.userWarehouse, 151398503);

//    console.log(this.input1);
    this.events.publish('home:entered'); 
    this.user.orderInfo.zone = '';
  }

  ionViewDidEnter() {
  	this.menu.swipeEnable(true);
  }


  openBarcodes()
  {
    this.events.publish('barcodes:start');
    this.navCtrl.setRoot('BarcodeScanBinPage');
  }

  openModule(alias:string)
  {


    let titles = {'binfo':'Bin Info', 
              'convpick':'Conveyor Pick', 
              'movstk':'Move Stock', 
              'p2l':'P2L Bulk', 
              'putway':'Put-Away', 
              'sinlin':'1 Liner  Pick'};

    if(alias=='binfo')
    {
      this.events.publish('bininfo:start');
      this.navCtrl.setRoot('ScanBinPage');
    }
    else if(alias=='convpick')
    {
      this.navCtrl.setRoot('ScanOrderPage');
    }
    else if(alias=='movstk')
    {
      this.events.publish('stockmove:start');
      this.navCtrl.setRoot('MoveStockSourcePage');
    }
    else if(alias=='p2l')
    {
      this.events.publish('p2ljob:start');
      this.navCtrl.setRoot('P2lBeginJobPage');      
    }
    else if(alias=='putway')
    {
      this.events.publish('putaway:start');
      this.navCtrl.setRoot('PutAwayJobListPage');
    }
    else if(alias=='sinlin')
    {
      this.events.publish('1line:start');
      this.navCtrl.setRoot('LinePickJobPage');      
    }

  }

}
