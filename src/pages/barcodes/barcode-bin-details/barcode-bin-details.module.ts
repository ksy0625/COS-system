import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeBinDetailsPage } from './barcode-bin-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BarcodeBinDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodeBinDetailsPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
