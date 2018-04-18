import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { P2lBeginJobPage } from './begin-job';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    P2lBeginJobPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(P2lBeginJobPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
