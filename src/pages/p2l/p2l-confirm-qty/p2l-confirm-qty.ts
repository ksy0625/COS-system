import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-p2l-confirm-qty',
  templateUrl: 'p2l-confirm-qty.html'
})
export class P2lConfirmQtyPage {
  resolve:(result:any)=>void;
  data:any;
  private noExistSuplusBin:boolean = true;

  constructor(public viewCtrl: ViewController, params: NavParams) 
  {
    this.resolve = params.data.resolve;
    this.data = params.data;

    console.log(this.data);
    if(this.data.productInfo.surplusBins !=null && this.data.productInfo.surplusBins.length >0)
      this.noExistSuplusBin = false;
  }

  onOK() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(1));
  }

  onCancel() {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(2));
  }

  onPark()
  {
    let svc = this;
    this.viewCtrl.dismiss().then(() => svc.resolve(3));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
