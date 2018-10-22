import { TaskService } from './services/task.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MaterialsModule } from './materials.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Custom Services
import { SharedService } from './services/shared.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MaterialsModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [
    SharedService,
    TaskService
  ]
})

export class SharedModule { }
