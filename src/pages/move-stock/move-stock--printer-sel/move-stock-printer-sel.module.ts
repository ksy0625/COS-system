import { MoveStockPrinterSelModalPage } from './move-stock-printer-sel';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MoveStockPrinterSelModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MoveStockPrinterSelModalPage),
  ],
  exports: [
    MoveStockPrinterSelModalPage
  ]
})

export class WalkthroughModalPageModule { }
