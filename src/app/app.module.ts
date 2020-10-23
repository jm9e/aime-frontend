import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {QuestionnaireComponent} from './pages/questionnaire/questionnaire.component';
import {IndexComponent} from './pages/index/index.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {EnvPipe} from './pipes/env.pipe';
import {DatabaseComponent} from './pages/database/database.component';
import {AboutComponent} from './pages/about/about.component';
import {QuFieldComponent} from './components/qu-field/qu-field.component';
import {CiteReportComponent} from './components/cite-report/cite-report.component';
import {SurveyComponent} from './pages/survey/survey.component';
import {MonacoEditorModule, NgxMonacoEditorConfig} from 'ngx-monaco-editor';

const monacoConfig: NgxMonacoEditorConfig = {
	baseUrl: 'assets',
	defaultOptions: { scrollBeyondLastLine: false }
};

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
		SurveyComponent,
	],
	imports: [
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		MonacoEditorModule.forRoot(monacoConfig),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
}
