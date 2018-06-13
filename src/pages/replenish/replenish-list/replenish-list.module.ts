import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReplenishListPage } from './replenish-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReplenishListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReplenishListPage),
    TranslateModule.forChild(),
  ],
})
export class PutAwayJobListPageModule {}
