import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { HistoryComponent } from './history/history.component';



@NgModule({
  declarations: [
    WelcomeComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
