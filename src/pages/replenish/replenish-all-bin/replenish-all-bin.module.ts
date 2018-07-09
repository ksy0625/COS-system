import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplenishAllBinPage } from './replenish-all-bin';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReplenishAllBinPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplenishAllBinPage),
    TranslateModule.forChild(),
  ],
})
export class PutAwayJobListPageModule {}
