import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-hint-modal',
  templateUrl: 'hint-modal.html'
})
export class HintModalPage {
  title:string;
  message:string;
  okTxt:string;
  icon:string;
  color:string;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.title = params.data.title;
    this.message = params.data.message;
    this.okTxt = params.data.okTxt;
    if(params.data.icon==null)
      this.icon = 'bulb';
    else
      this.icon = params.data.icon;

    if(params.data.color==null)
      this.color = 'danger';
    else
      this.color = params.data.color;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
