import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BinDetailesPage } from './bin-detailes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BinDetailesPage,
  ],
  imports: [
    IonicPageModule.forChild(BinDetailesPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
