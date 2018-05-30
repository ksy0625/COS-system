import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PutAwayDestPage } from './put-away-dest';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PutAwayDestPage,
  ],
  imports: [
    IonicPageModule.forChild(PutAwayDestPage),
    TranslateModule.forChild(),
  ],
})
export class ScanProductPageModule {}
