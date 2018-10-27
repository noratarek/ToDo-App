import { Injectable } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class AuthServiceService {

  constructor(private uss: UserService) { }

  login(loginModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uss.login(loginModel.email, loginModel.password)
      .then(user => {
        resolve(user);
      }).catch(err => {
        reject();
      });
    });
  }

  isLoggedIn() {
    console.log(this.uss.isLoggedIn);
  }

  logout() {
    return this.uss.logout();
  }

}
