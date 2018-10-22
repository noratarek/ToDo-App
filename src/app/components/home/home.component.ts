import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../shared/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  productId: string;
  codes = [];
  subscription: Subscription;
  subscription2: Subscription;
  uploadRef: any;
  task: any;
  uploadProgress: any;
  product = <any>{};
  multiCodes = [];
  generateProgress = 0;
  showGenerateShade = false;

  constructor(
    public taskService: TaskService,
    public translate: TranslateService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
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
