import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoveStockSourcePage } from './move-stock-source';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MoveStockSourcePage,
  ],
  imports: [
    IonicPageModule.forChild(MoveStockSourcePage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
