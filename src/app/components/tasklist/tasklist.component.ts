import { Component, OnInit, OnDestroy } from '@angular/core';
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
  taskList = [];
  completedTasks = [];
  subscription: Subscription = null;
  task: any;

  constructor(
    public taskService: TaskService,
    public translate: TranslateService,
    public snackBar: MatSnackBar,
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.subscription = this.taskService.getTaskList().subscribe(result => {
      this.taskList = result;
      this.completedTasks = this.taskList.filter(task => task.done);
    });
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
      this.taskService.addTask(this.newTask).then(res => {
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
