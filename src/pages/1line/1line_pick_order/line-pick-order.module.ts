import { SharedModule } from '../../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinePickOrderPage } from './line-pick-order';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LinePickOrderPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(LinePickOrderPage),
    TranslateModule.forChild()
  ],
})
export class ScanOrderPageModule {}
