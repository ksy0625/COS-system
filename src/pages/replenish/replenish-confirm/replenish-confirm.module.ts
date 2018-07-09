import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplenishConfirmPage } from './replenish-confirm';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReplenishConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplenishConfirmPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
