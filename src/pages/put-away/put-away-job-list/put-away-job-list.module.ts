import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PutAwayJobListPage } from './put-away-job-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PutAwayJobListPage,
  ],
  imports: [
    IonicPageModule.forChild(PutAwayJobListPage),
    TranslateModule.forChild(),
  ],
})
export class PutAwayJobListPageModule {}
