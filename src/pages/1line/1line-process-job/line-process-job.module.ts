import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LineProcessJobPage } from './line-process-job';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LineProcessJobPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(LineProcessJobPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
