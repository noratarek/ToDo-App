import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable()
export class SharedService {
    fireApp: any;

    constructor(private db: AngularFireDatabase, private stor: AngularFireStorage, @Inject(FirebaseApp) firebaseApp: any) {
        this.fireApp = firebaseApp;
    }

    nl2br(str: string) {
        const br = '<br>';
        const brokenString = str
            .replace(/\r\n/g, br)
            .replace(/\r/g, br)
            .replace(/\n/g, br);
        return brokenString;
    }

    getPageConfig(path: string) {
        return this.db.object(path + '/config');
    }
    getListAsSnapshot(url, query): Observable<AngularFireAction<firebase.database.DataSnapshot>[]> {
        return this.db.list(url, query).snapshotChanges();
    }

    getListAsValue(url, query): Observable<{}[]> {
        return this.db.list(url, query).valueChanges();
    }

    getObject(url) {
        return this.db.object(url).valueChanges();
    }

    getObjectOnce(url) {
        return this.db.object(url).valueChanges().pipe(take(1)).toPromise();
    }

    getObjectAsSnapshot(url) {
        return this.db.object(url).snapshotChanges();
    }

    updateObject(url, data) {
        return this.db.object(url).update(data);
    }

    saveObject(url, data) {
        return this.db.object(url).set(data);
    }

    pushObjectToList(url, data) {
        return this.db.list(url).push(data);
    }
    deleteObject(url) {
        return this.db.object(url).set(null);
    }

    deleteStorageFile(path) {
        return this.stor.ref(path).delete();
    }

    uploadBlobToURL(url, blob) {
        return this.stor.ref(url).put(blob);
    }

    /**
     * Gets a Firebase URL to the file
     * @param path path of the file in Firebase Storage
     */
    getFileURL(path: String): Promise<string> {
        const storageRef = this.fireApp.storage().ref().child(path);
        return storageRef.getDownloadURL();
    }
}
