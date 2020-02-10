import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';
import { IndexComponent } from './pages/index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EnvPipe } from './pipes/env.pipe';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { DatabaseComponent } from './pages/database/database.component';
import { AboutComponent } from './pages/about/about.component';
import { QuFieldComponent } from './components/qu-field/qu-field.component';
import { CiteReportComponent } from './components/cite-report/cite-report.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionnaireComponent,
    IndexComponent,
    EnvPipe,
    DatabaseComponent,
    AboutComponent,
    QuFieldComponent,
    CiteReportComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PdfJsViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
