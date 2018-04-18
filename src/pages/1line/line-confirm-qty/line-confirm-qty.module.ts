import { LineConfirmQtyPage } from './line-confirm-qty';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LineConfirmQtyPage,
  ],
  imports: [
    IonicPageModule.forChild(LineConfirmQtyPage),
  ],
  exports: [
    LineConfirmQtyPage
  ]
})

export class SignupModalPageModule { }
