import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PutAwayJobFoundPage } from './put-away-job-found';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PutAwayJobFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(PutAwayJobFoundPage),
    TranslateModule.forChild(),
  ],
})
export class PutAwayJobListPageModule {}
