import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceInTotePage } from './place-in-tote';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlaceInTotePage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceInTotePage),
    TranslateModule.forChild(),
  ],
})
export class PlacInTotePageModule {}
