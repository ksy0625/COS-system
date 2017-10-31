import { SharedModule } from '../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanOrderPage } from './scan-order';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ScanOrderPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(ScanOrderPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
