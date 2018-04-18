import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanProductPage } from './scan-product';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ScanProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanProductPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
