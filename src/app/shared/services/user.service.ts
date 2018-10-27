import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {
    fireApp: any;
    userUID = '';
    userObject: any = {};
    userDepartments: any;

    userObjectSubscription: Subscription;
    userDepsSubscription: Subscription;

    constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, @Inject(FirebaseApp) firebaseApp: any) {
        this.fireApp = firebaseApp;
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            this.auth.auth.signInWithEmailAndPassword(email, password).then(
                (success) => {
                    this.userUID = success.uid;
                    resolve();
                }).catch(
                (err) => {
                    console.log(err);
                    reject(err.message);
                });
        });
    }

    logout() {
        // Unset selected module in local storage
        localStorage.setItem('switchSelection', null);
        return this.auth.auth.signOut();
    }

    isLoggedIn(): Observable<boolean> {
        return this.auth.authState.map((auth) => {
            if (auth == null) {
                return false;
            } else {
                this.userUID = auth.uid;
                return true;
            }
        });
    }

    public get getUserId() {
        return this.auth.auth.currentUser.uid;
    }

    public get observeUserId() {
        return this.auth.authState.map((auth) => {
            if (auth == null) {
                return '';
            } else {
                return auth.uid;
            }
        });
    }

    public get observeUser() {
        return this.auth.authState.map((auth) => {
            if (auth == null) {
                return Observable.of(null);
            } else {
                return this.db.object(`/users/${auth.uid}`).valueChanges().map(user => user);
            }
        });
    }

    getUser(uid?) {
        return new Promise((resolve, reject) => {
            if (this.auth.auth.currentUser) {
                this.db.object(`users/${this.auth.auth.currentUser.uid}`).valueChanges().pipe(take(1)).toPromise().then((user: any) => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject('');
                    }
                });
             } else if (uid) {
                this.db.object(`users/${uid}`).valueChanges().pipe(take(1)).toPromise().then((user: any) => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject('');
                    }
                });
             } else {
                reject('');
            }
        });
    }

    public get getUserType() {
        return new Promise((resolve, reject) => {
            if (this.auth.auth.currentUser) {
                this.db.object(`users/${this.auth.auth.currentUser.uid}/type`).valueChanges().toPromise().then((type: any) => {
                    if (type) {
                        resolve(type);
                    } else {
                        reject('');
                    }
                });
            } else {
                reject('');
            }
        });
    }
}
