import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { P2lScanProductPage } from './p2l-scan-product';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    P2lScanProductPage,
  ],
  imports: [
    IonicPageModule.forChild(P2lScanProductPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
