import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular';

@Injectable()
export class UtilService {
  loading:Loading;
  constructor(public loadingCtrl: LoadingController) { 
    this.loading = null;
  }

  presentLoading() {
    if(this.loading!=null)
    {
      this.hideLoading();
    }

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      duration:  6000
    });
    this.loading.present();
  }

  hideLoading()
  {
    if(this.loading != null)
    {
      this.loading.dismiss();
      this.loading = null;    
    }
  }


}
