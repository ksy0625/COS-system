import { Injectable } from '@angular/core';
import { ModalController} from 'ionic-angular';


@Injectable()
export class ModalService {
  constructor(
    public modalCtrl: ModalController
  ) { }

  doModal(title:string, message:string, okTxt:string, color:string, icon:string)
  {
    let data ={title:title, message:message, okTxt:okTxt, color:color, icon};
    this.openModal('HintModalPage', data);    
  }

  // openHintModal() {
  //   this.openModal('HintModalPage');
  // }

  // openWalkthroughModal() {
  //   this.openModal('WalkthroughModalPage');
  // }

  // openSignupModal() {
  //   this.openModal('SignupModalPage');
  // }

  private openModal(pageName:string, data:any) {
    this.modalCtrl.create(pageName, data, { cssClass: 'inset-modal' })
                  .present();
  }


}
