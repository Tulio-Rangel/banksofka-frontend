import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WelcomeComponent } from './user/welcome/welcome.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { HistoryComponent } from './user/history/history.component';
import { MainLayoutComponent } from './user/main-layout/main-layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'history', component: HistoryComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
