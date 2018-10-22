import { TaskService } from './shared/services/task.service';
import { ListsComponent } from './components/lists/lists.component';
import { HomeComponent } from './components/home/home.component';
import { SharedService } from './shared/services/shared.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialsModule } from './shared/materials.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TasklistComponent } from './components/tasklist/tasklist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListsComponent,
    TasklistComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    FormsModule,
    FlexLayoutModule,
  ],
  providers: [
    SharedService,
    TaskService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
