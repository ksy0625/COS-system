import { ConfirmModalPage } from './confirm-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ConfirmModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmModalPage),
  ],
  exports: [
    ConfirmModalPage
  ]
})

export class SignupModalPageModule { }
