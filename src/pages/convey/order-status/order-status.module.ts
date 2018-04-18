import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusPage } from './order-status';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatusPage),
    TranslateModule.forChild(),
  ],
})
export class OrderStatusPageModule {}
