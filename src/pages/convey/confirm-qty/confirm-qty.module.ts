import { ConfirmQtyPage } from './confirm-qty';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ConfirmQtyPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmQtyPage),
  ],
  exports: [
    ConfirmQtyPage
  ]
})

export class SignupModalPageModule { }
