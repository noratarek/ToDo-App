import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ListService } from '../../shared/services/list.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  newList: string;
  lists: any[];
  activeListKey: string;
  @Input() userKey: string;
  @Output() activatedList = new EventEmitter<any>();
  constructor(
    public listService: ListService,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    this.subscription = this.listService.getUserLists(this.userKey).subscribe((lists: any) => {
      this.lists = lists;
      if (this.lists && this.lists[0]) {
        this.activateList(this.lists[0].key);
      }
    });
  }

  add() {
    if (this.newList) {
      this.listService.addList(this.newList, this.userKey).then(res => {
        this.newList = null;
      });
    }
  }

  activateList(listKey) {
    this.activeListKey = listKey;
    this.activatedList.emit(listKey);
  }

  deleteList(listkey) {
    if (window.confirm('Are you sure you want to delete this list?')) {
      this.listService.deleteList(listkey).then(success => {
        this.snackBar.open('List Deleted Successfully.', 'X', { duration: 1000 });
      }).catch(error => {
        this.snackBar.open('Error.', 'X', { duration: 1000 });
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
