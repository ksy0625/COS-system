import { Injectable } from '@angular/core';
import { ModalController} from 'ionic-angular';



@Injectable()
export class ModalService {

  constructor(
    public modalCtrl: ModalController
  ) { }

  doAlert(title:string, message:string, okTxt:string, color:string, icon:string)
  {
    let data ={title:title, message:message, okTxt:okTxt, color:color, icon};
    this.openModal('AlertModalPage', data);    
  }


  doConfirm(title:string, message:string, okTxt:string, cancelTxt:string, icon:string): Promise<boolean> {
    let svc = this;
    return new Promise((resolve, reject) => {
      let data ={title:title, message:message, okTxt:okTxt, cancelTxt:cancelTxt, resolve:resolve, icon:icon};
      const confirm = svc.modalCtrl.create('ConfirmModalPage', data, { cssClass: 'inset-modal' })
      return confirm.present();
    });
  }  
  
  showConfirmModal(page:string, cls:string, data:any): Promise<boolean> {
    let svc = this;
    return new Promise((resolve, reject) => {
      data.resolve = resolve;
      const confirm = svc.modalCtrl.create(page, data, { cssClass: cls })
      return confirm.present();
    });
  } 

  doPrompt(title:string, message:string, okTxt:string, cancelTxt:string, icon:string, placeholder:string): Promise<string> {
    let svc = this;
    return new Promise((resolve, reject) => {
      let data ={title:title, message:message, okTxt:okTxt, cancelTxt:cancelTxt, resolve:resolve, icon:icon, placeholder:placeholder};
      const confirm = svc.modalCtrl.create('PromptModalPage', data, { cssClass: 'inset-modal_prompt_noraml' })
      return confirm.present();
    });
  }  

  doPromptRightSide(title:string, message:string, okTxt:string, cancelTxt:string, icon:string, placeholder:string): Promise<string> {
    let svc = this;
    return new Promise((resolve, reject) => {
      let data ={title:title, message:message, okTxt:okTxt, cancelTxt:cancelTxt, resolve:resolve, icon:icon, placeholder:placeholder};
      const confirm = svc.modalCtrl.create('PromptModalPage', data, { cssClass: 'inset-modal_prompt_right_side' })
      return confirm.present();
    });
  }  


  private openModal(pageName:string, data:any) {
    this.modalCtrl.create(pageName, data, { cssClass: 'inset-modal' })
                  .present();
  }


}
