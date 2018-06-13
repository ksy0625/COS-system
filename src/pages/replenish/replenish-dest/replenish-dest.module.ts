import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplenishDestPage } from './replenish-dest';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReplenishDestPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplenishDestPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
