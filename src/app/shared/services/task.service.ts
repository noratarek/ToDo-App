import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs/operators';

@Injectable()
export class TaskService {
    readonly tasksPath = 'task';
    readonly codesPath = 'taskCodes';

    constructor(private ss: SharedService,  private http: HttpClient) {}

    getTaskList(): Observable<any[]> {
        return this.ss.getListAsSnapshot(this.tasksPath, null).map(taskList => {
            return taskList.map(c => Object.assign(c.payload.val(), { key: c.payload.key }));
        });
    }

    getTask(key) {
        return this.ss.getObject(`${this.tasksPath}/${key}`);
      }

    addTask(task) {
        return this.ss.pushObjectToList(`${this.tasksPath}`, task); }


    deleteTask(taskKey): Promise<void> {
        return this.ss.deleteObject(`${this.tasksPath}/${taskKey}`);
    }

    generateRandomCode(): string {
        let text = '';
        const possible = '0123456789';
        for (let i = 0; i < 13; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    getCodesList(taskId): Observable<any[]> {
        return this.ss.getListAsSnapshot(
            this.codesPath,
            ref => ref.orderByChild('taskId').equalTo(taskId).limitToFirst(50)
        ).map(codesList => {
            return codesList
            .map(c => Object.assign(c.payload.val(), { key: c.payload.key }))
            .sort((a, b) => {
                return (a.timestamp || 0) - (b.timestamp || 0);
            });
        });
    }

    getCodesListNext(taskId, num): Observable<any[]> {
        return this.ss.getListAsSnapshot(
            this.codesPath,
            ref => ref.orderByChild('taskId').equalTo(taskId).limitToFirst(num + 50)
        ).map(codesList => {
            return codesList
                .map(c => Object.assign(c.payload.val(), { key: c.payload.key }))
                .sort((a, b) => {
                    return (a.timestamp || 0) - (b.timestamp || 0);
                });
        });
    }

    checkCodeUnique(codeId) {
        return new Promise((resolve) => {
            this.ss.getObjectOnce(`${this.codesPath}/${codeId}`).then((snap) => {
                console.log('code Snapshot:', snap);
                if (snap === null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    createNewCode(taskId) {
        return new Promise((resolve) => {
            const code = this.generateRandomCode();
            this.checkCodeUnique(code).then((unique) => {
                if (unique) {
                    this.ss.saveObject(`${this.codesPath}/${code}`, {
                        timestamp: (new Date().getTime()),
                        taskId,
                    }).then(() => {
                        resolve(code);
                    });
                } else {
                    this.createNewCode(taskId).then((newCode) => {
                        resolve(newCode);
                    });
                }
            });
        });
    }

    uploadImportedFile(file, taskId, fileName) {
        const uploadTask = this.ss.uploadBlobToURL(`${taskId}/${fileName}.csv` , file);
        return {
            uploadTask,
            progress: uploadTask.percentageChanges(),
        };
    }

    exportCodes(taskId) {
        return new Promise((resolve, reject) => {
            // call the callable http function
            this.http.get(`https://us-central1-${environment.firebase.projectId}.cloudfunctions.net/exportToCsv/${taskId}`)
            .pipe(take(1)).subscribe((res: any) => {
                console.log('response:', res);
                if (res) {
                    resolve(res);
                } else {
                    reject();
                }
            });
        });
    }

    getFirebaseDownloadURL(url) {
        return this.ss.getFileURL(url);
    }
}
