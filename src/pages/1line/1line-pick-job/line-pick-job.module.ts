import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinePickJobPage } from './line-pick-job';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LinePickJobPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(LinePickJobPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
