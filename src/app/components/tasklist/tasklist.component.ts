import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { TaskService } from '../../shared/services/task.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit, OnDestroy {

  newTask: string;
  completedTasks = [];
  subscription: Subscription = null;
  listKey: string;
  taskList: any[];

  constructor(
    public taskService: TaskService,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
  }

  updateStatus(taskKey, value) {
    this.taskService.updateStatus(taskKey, value).then().catch((err => {
      this.snackBar.open('Error.', 'X', { duration: 1000 });
    }));
  }

  clearCompleted() {
    if (this.completedTasks && this.completedTasks.length > 0) {
      this.completedTasks.forEach(task => {
        this.taskService.deleteTask(task.key).catch(err => {
          this.snackBar.open('Error.', 'X', { duration: 1000 });
        });
      });
    } else {
      this.snackBar.open('Error.', 'X', { duration: 1000 });
    }
  }

  add() {
    if (this.newTask) {
      this.taskService.addTask(this.newTask, this.listKey).then(res => {
        this.newTask = null;
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
