import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplenishSourcePage } from './replenish-source';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReplenishSourcePage,
  ],
  imports: [
    IonicPageModule.forChild(ReplenishSourcePage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
