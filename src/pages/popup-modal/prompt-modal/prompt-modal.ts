import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-prompt-modal',
  templateUrl: 'prompt-modal.html'
})
export class PromptModalPage {

  resolve:(result:any)=>void;  
  title:string;
  message:string;
  okTxt:string;
  cancelTxt:string;
  icon:string;
  placeholder:string;
  promptVal:string;

  constructor(public viewCtrl: ViewController, params: NavParams) 
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
  }

  onOK() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(svc.promptVal));
  }

  onCancel() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(''));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
