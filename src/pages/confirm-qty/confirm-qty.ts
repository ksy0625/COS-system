import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirm-qty',
  templateUrl: 'confirm-qty.html'
})
export class ConfirmQtyPage {
  resolve:(result:any)=>void;
  data:any;

  constructor(public viewCtrl: ViewController, params: NavParams) 
  {
    this.resolve = params.data.resolve;
    this.data = params.data;
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
