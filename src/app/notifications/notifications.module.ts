import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalNotificationsComponent } from './global-notifications/global-notifications.component';



@NgModule({
  declarations: [
    GlobalNotificationsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalNotificationsComponent
  ]
})
export class NotificationsModule { }
