import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginAuthGuardService } from './components/auth/login/login-auth-guard.service';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuardService } from './components/auth/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    canActivate: [LoginAuthGuardService],
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
