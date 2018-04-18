import { LinePrinterSelModalPage } from './line-printer-sel';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LinePrinterSelModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LinePrinterSelModalPage),
  ],
  exports: [
    LinePrinterSelModalPage
  ]
})

export class WalkthroughModalPageModule { }
