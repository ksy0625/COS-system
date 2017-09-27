import { PromptModalPage } from './prompt-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PromptModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PromptModalPage),
  ],
  exports: [
    PromptModalPage
  ]
})

export class WalkthroughModalPageModule { }
