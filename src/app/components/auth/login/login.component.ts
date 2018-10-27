import { UserService } from './../../../shared/services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent {
  public error: string;

  model: LoginModel;
  constructor(
    private router: Router,
    public translate: TranslateService,
    private auth: AuthServiceService,
    private snackBar: MatSnackBar,
  ) {
    this.model = { email: '', password: '' };
    this.translate.setDefaultLang('en');
  }

  login() {
    this.auth.login(this.model)
    .then(user => {
        this.snackBar.open('Logged In Successfuly!', 'X');
        this.router.navigate(['']);
    }).catch(err => {
      this.translate.get('errors.login').subscribe(data => {
        this.snackBar.open(data, 'X');
      });
    });
  }
}

interface LoginModel {
  email: string;
  password: string;
}
