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
  selector: 'move-stock-printer-sel-modal',
  templateUrl: 'move-stock-printer-sel.html'
})
export class MoveStockPrinterSelModalPage {

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
}
