import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PutAwaySourcePage } from './put-away-source';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PutAwaySourcePage,
  ],
  imports: [
    IonicPageModule.forChild(PutAwaySourcePage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
