import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PutAwayJobPage } from './put-away-job';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PutAwayJobPage,
  ],
  imports: [
    IonicPageModule.forChild(PutAwayJobPage),
    TranslateModule.forChild(),
  ],
})
export class PutAwayJobListPageModule {}
