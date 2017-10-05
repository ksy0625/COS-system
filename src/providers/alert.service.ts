import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {
  constructor(public alertCtrl: AlertController) { 
  }

  public doAlert(title: string, message: string, btnTxt:string ) {
    const alert = this.alertCtrl.create(
      {
        title,
        subTitle: message,
        buttons: [
          {
            text: btnTxt
          }
        ]
      });
    return alert.present();
  }

  doConfirm(title: string, message: string, okTxt:string, cancelTxt:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confirm = this.alertCtrl.create({
        title,
        message,
        buttons: [{
          text: cancelTxt,
          role: 'cancel',
          handler: () => {
            confirm.dismiss().then(() => resolve(false));
            return false;
          }
        }, {
          text: okTxt,
          handler: () => {
            confirm.dismiss().then(() => resolve(true));
            return false;
          }
        }]
      });
      return confirm.present();
    });
  }  

  doPrompt(title: string, message: string, okTxt:string, cancelTxt:string, placeHold:string): Promise<string> {
    return new Promise((resolve, reject) => {
      const confirm = this.alertCtrl.create({
        title,
        message,
        inputs: [
          {
            name: 'promptValue',
            placeholder: placeHold,
          },
        ],        
        buttons: [{
          text: cancelTxt,
          role: 'cancel',
          handler: (data:any) => {
            confirm.dismiss().then(() => resolve(''));
            return false;
          }
        }, {
          text: okTxt,
          handler: (data:any) => {
            confirm.dismiss().then(() => resolve(data.promptValue));
            return false;
          }
        }]
      });
      return confirm.present();
    });
  }  


}
