import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirm-modal',
  templateUrl: 'confirm-modal.html'
})
export class ConfirmModalPage {
  resolve:(result:any)=>void;  
  title:string;
  message:string;
  okTxt:string;
  cancelTxt:string;
  icon:string;

  constructor(public viewCtrl: ViewController, params: NavParams) 
  {
    this.resolve = params.data.resolve;
    this.title = params.data.title;
    this.message = params.data.message;
    this.okTxt = params.data.okTxt;
    this.cancelTxt = params.data.cancelTxt;
    if(params.data.icon==null)
      this.icon = 'bulb';
    else
      this.icon = params.data.icon;    
  }

  onOK() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(true));
  }

  onCancel() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(false));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
