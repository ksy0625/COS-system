import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeScreenPage } from './barcode-screen';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BarcodeScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodeScreenPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
