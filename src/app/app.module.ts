import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DatasetViewComponent } from './components/dataset-view/dataset-view.component';
import { ModelViewComponent } from './components/model-view/model-view.component';
import { MetricViewComponent } from './components/metric-view/metric-view.component';
import { DatasetItemComponent } from './components/dataset-item/dataset-item.component';
import { ModelItemComponent } from './components/model-item/model-item.component';
import { MetricItemComponent } from './components/metric-item/metric-item.component';
import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { TokenInputComponent } from './components/token-input/token-input.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DatasetViewComponent,
    ModelViewComponent,
    MetricViewComponent,
    DatasetItemComponent,
    ModelItemComponent,
    MetricItemComponent,
    ExportDialogComponent,
    TokenInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 