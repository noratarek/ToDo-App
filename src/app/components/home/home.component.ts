import { TasklistComponent } from './../tasklist/tasklist.component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TaskService } from '../../shared/services/task.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  subscription2: Subscription;
  userKey: string;
  @ViewChild(TasklistComponent) tasklistComponent: TasklistComponent;

  constructor(
    public userService: UserService,
    public taskService: TaskService,
  ) {
  }

  ngOnInit() {
    this.userKey = this.userService.getUserId;
  }

  changeActiveList(listKey) {
    this.subscription = this.taskService.getTaskList(listKey).subscribe(tasks => {
      this.tasklistComponent.taskList = tasks;
      this.tasklistComponent.listKey = listKey;
      if (tasks && tasks.length >= 1) {
        this.tasklistComponent.completedTasks = tasks.filter(task => task.done);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

}
