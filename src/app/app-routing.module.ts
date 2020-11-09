import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {QuestionnaireComponent} from './pages/questionnaire/questionnaire.component';
import {IndexComponent} from './pages/index/index.component';
import {DatabaseComponent} from './pages/database/database.component';
import {SurveyComponent} from './pages/survey/survey.component';
import {AboutComponent} from './pages/about/about.component';
import {SpecificationComponent} from './pages/specification/specification.component';
import {ReportComponent} from './pages/report/report.component';
import {ContributeComponent} from './pages/contribute/contribute.component';
import {IssueComponent} from './pages/issue/issue.component';


const routes: Routes = [
	{
		path: '',
		component: IndexComponent,
	},
	{
		path: 'questionnaire',
		component: QuestionnaireComponent,
	},
	{
		path: 'database',
		component: DatabaseComponent,
	},
	{
		path: 'survey',
		component: SurveyComponent,
	},
	{
		path: 'specification',
		component: SpecificationComponent,
	},
	{
		path: 'contribute',
		component: ContributeComponent,
	},
	{
		path: 'report/:id',
		component: ReportComponent,
	},
	{
		path: 'report/:id/:version',
		component: ReportComponent,
	},
	{
		path: 'report/:id/issue/:issue',
		component: IssueComponent,
	},
	{
		path: 'about',
		component: AboutComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
