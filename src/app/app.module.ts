import { ListService } from './shared/services/list.service';
import { AuthServiceService } from './components/auth/auth-service.service';
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
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuardService } from './components/auth/auth-guard.service';
import { LoginAuthGuardService } from './components/auth/login/login-auth-guard.service';
import { UserService } from './shared/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListsComponent,
    TasklistComponent,
    LoginComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [
    SharedService,
    TaskService,
    ListService,
    AuthGuardService,
    LoginAuthGuardService,
    UserService,
    AuthServiceService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
