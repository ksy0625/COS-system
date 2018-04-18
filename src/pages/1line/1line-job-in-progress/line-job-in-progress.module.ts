import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LineJobInProgressPage } from './line-job-in-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LineJobInProgressPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(LineJobInProgressPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
