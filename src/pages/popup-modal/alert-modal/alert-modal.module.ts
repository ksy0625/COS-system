import { AlertModalPage } from './alert-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AlertModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AlertModalPage),
  ],
  exports: [
    AlertModalPage
  ]
})

export class HintModalPageModule { }
