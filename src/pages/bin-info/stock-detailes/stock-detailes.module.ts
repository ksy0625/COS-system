import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockDetailesPage } from './stock-detailes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StockDetailesPage,
  ],
  imports: [
    IonicPageModule.forChild(StockDetailesPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
