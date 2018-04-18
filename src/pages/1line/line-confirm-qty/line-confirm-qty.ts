import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-line-confirm-qty',
  templateUrl: 'line-confirm-qty.html'
})
export class LineConfirmQtyPage {
  resolve:(result:any)=>void;
  data:any;

  constructor(public viewCtrl: ViewController, params: NavParams) 
  {
    this.resolve = params.data.resolve;
    this.data = params.data;

    console.log(this.data);
  }

  onOK() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(1));
  }

  onCancel() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(2));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
