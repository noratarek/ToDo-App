import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListService {
    readonly listsPath = 'lists';

    constructor(private ss: SharedService) { }

    getUserLists(userKey): Observable<any[]> {
        return this.ss.getListAsSnapshot(`${this.listsPath}`, ref => ref.orderByChild('userKey').equalTo(userKey)).map(listList => {
            return listList.map(c => Object.assign(c.payload.val(), { key: c.payload.key }));
        });
    }

    getList(key) {
        return this.ss.getObject(`${this.listsPath}/${key}`);
    }

    addList(listName, userKey) {
        return this.ss.pushObjectToList(`${this.listsPath}`, { name: listName, userKey: userKey });
    }

    deleteList(listKey): Promise<void> {
        return this.ss.deleteObject(`${this.listsPath}/${listKey}`);
    }
}
