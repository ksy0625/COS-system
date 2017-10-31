import { SharedModule } from '../../app/shared.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeScreenPage } from './home-screen';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeScreenPage,
  ],
  imports: [
  	SharedModule,
    IonicPageModule.forChild(HomeScreenPage),
    TranslateModule.forChild()
  ],
})
export class HomeScreenPageModule {}
