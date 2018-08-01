import { Component , ViewChild} from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-prompt-modal',
  templateUrl: 'prompt-modal.html'
})
export class PromptModalPage {

  @ViewChild('promptInputBox') promptInput ;

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
  placeholder:string;
  promptVal:string;
  dismissed:boolean = false;

  didUnload:boolean = false;

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
    this.placeholder = params.data.placeholder;
    if(params.data.icon==null)
      this.icon = 'bulb';
    else
      this.icon = params.data.icon;  

    this.keysTab = [ "1", "2", "3", "4", "5", "6","7", "8", "9", 
                     "0", "A", "B", "C", "D", "E", "F",".", "<Back"];

    this.m_main_rows = this.range(0, (this.keysTab.length - 1), this.m_main_column_nb);
    this.m_main_cols = this.range(0, this.m_main_column_nb - 1, 1);                     
    this.timerTick();
  }


  ionViewDidLoad() {
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
    this.onOK();    
  }

  onOK() {
    let svc = this;
    this.dismissed=true;
    this.viewCtrl.dismiss().then(() => svc.resolve(svc.promptVal));
  }

  onCancel() {
    let svc = this;
    this.dismissed=true;
    this.viewCtrl.dismiss().then(() => svc.resolve(''));
  }

  dismiss() {
    this.dismissed=true;
    this.viewCtrl.dismiss();
  }

  timerTick()
  {
    if(this.didUnload)return;
    
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
