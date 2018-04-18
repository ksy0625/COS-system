import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { P2lScan1stlabelPage } from './p2l-scan-1stlabel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    P2lScan1stlabelPage,
  ],
  imports: [
    IonicPageModule.forChild(P2lScan1stlabelPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
