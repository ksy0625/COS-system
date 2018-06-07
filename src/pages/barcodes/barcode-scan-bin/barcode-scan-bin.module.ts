import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeScanBinPage } from './barcode-scan-bin';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BarcodeScanBinPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(BarcodeScanBinPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
