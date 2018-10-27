import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskService {
    readonly tasksPath = 'tasks';

    constructor(private ss: SharedService) { }

    getTaskList(listKey): Observable<any[]> {
        return this.ss.getListAsSnapshot(this.tasksPath,  ref => ref.orderByChild('listKey').equalTo(listKey)).map(taskList => {
            return taskList.map(c => Object.assign(c.payload.val(), { key: c.payload.key }));
        });
    }

    getTask(key) {
        return this.ss.getObject(`${this.tasksPath}/${key}`);
    }

    addTask(taskName, listKey) {
        return this.ss.pushObjectToList(`${this.tasksPath}`, { name: taskName, listKey: listKey });
    }

    deleteTask(taskKey): Promise<void> {
        return this.ss.deleteObject(`${this.tasksPath}/${taskKey}`);
    }

    updateStatus(key, done) {
        return this.ss.updateObject(`${this.tasksPath}/${key}`, { done });
    }
}
