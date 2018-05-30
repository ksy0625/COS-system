import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoveStockDestPage } from './move-stock-dest';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MoveStockDestPage,
  ],
  imports: [
    IonicPageModule.forChild(MoveStockDestPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
