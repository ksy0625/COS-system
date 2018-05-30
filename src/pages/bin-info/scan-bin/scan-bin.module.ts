import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanBinPage } from './scan-bin';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ScanBinPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(ScanBinPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
