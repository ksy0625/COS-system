import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { P2lJobInProgressPage } from './p2l-job-in-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    P2lJobInProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(P2lJobInProgressPage),
    TranslateModule.forChild(),
  ],
})
export class PlacInTotePageModule {}
