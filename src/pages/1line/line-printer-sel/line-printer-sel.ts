import { Component , ViewChild} from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';

export class printer{
  printerName:string = '';
  printerAddress:string = '';
} 



@IonicPage()
@Component({
  selector: 'line-printer-sel-modal',
  templateUrl: 'line-printer-sel.html'
})
export class LinePrinterSelModalPage {

  @ViewChild('promptInputBox') promptInput ;

  didUnload:boolean = false;
  bShowKb:boolean = false;
  m_main_column_nb:number = 9;
  m_main_rows:any;
  m_main_cols:any;
  keysTab:string[]=[];

  resolve:(result:any)=>void;  
  title:string;
  message:string;
  okTxt:string;
  cancelTxt:string;
  icon:string;
  promptVal:string ='';
  promptVal1:string = ''; 
  printers:printer[] = [];

  dismissed:boolean = false;

  constructor(public viewCtrl: ViewController, 
        private platform: Platform,
        private keyboard:Keyboard,
    params: NavParams) 
  {
    this.promptVal = '';
    this.resolve = params.data.resolve;
    this.title = params.data.title;
    this.message = params.data.message;
    this.okTxt = params.data.okTxt;
    this.cancelTxt = params.data.cancelTxt;
    this.printers = params.data.printers;


    if(params.data.icon==null)
      this.icon = 'bulb';
    else
      this.icon = params.data.icon;  

    this.keysTab = [ "1", "2", "3", "4", "5", "6","7", "8", "9", 
                     "0", "<Back"];

    this.m_main_rows = this.range(0, (this.keysTab.length - 1), this.m_main_column_nb);
    this.m_main_cols = this.range(0, this.m_main_column_nb - 1, 1);    
           
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter()
  {
    this.didUnload = false;
    this.timerTick();
  }  

  ionViewWillLeave()
  {
    this.didUnload = true;
  }    

  private range(min, max, step)
  {    
      step = step || 1;
      var tab = [];
      for (var i = min; i <= max; i += step) {
          tab.push(i);
      }
      return tab;
  }

  onChangedVal(val:string)
  {
    if(val=='')
      return;
    this.promptVal = val;
  }

  onOK() {
    let svc = this;
    this.dismissed=true;
    let result = {qty:svc.promptVal, printer:svc.promptVal1};
    this.viewCtrl.dismiss().then(() => svc.resolve(result));
  }

  onCancel() {
    let svc = this;
    this.dismissed=true;
    this.viewCtrl.dismiss().then(() => svc.resolve(null));
  }

  dismiss() {
    this.dismissed=true;
    this.viewCtrl.dismiss();
  }

  timerTick()
  {
    if(this.didUnload==true)return;
    
    let svc = this;
    setTimeout(() => {

        if (svc.platform.is('cordova'))
          this.keyboard.close();        
        if(this.bShowKb ==false)
        {
          if(this.promptInput._isFocus ==false)
          {
            this.promptInput._readonly = true;
            this.promptInput.setFocus();
            setTimeout(() =>{
              svc.promptInput._readonly = false;
            }, 40);
          }
        }

      if(this.dismissed==false)
        this.timerTick();
    },100); //a least 150ms.
  }

  onShowKeyPad()
  {
    this.bShowKb =!this.bShowKb;
  }

  cKClick(event, key: any)
  {
    if(key != "<Back")
      this.promptVal += key;
    else
      this.promptVal = this.promptVal.slice(0, this.promptVal.length -1);
  }
}
