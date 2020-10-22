import { Component, OnInit, ViewChild } from '@angular/core';
import { IQuestion, createDefaults, score, validateRec, ScoreType, maxScore } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-questionnaire',
	templateUrl: './questionnaire.component.html',
	styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

	@ViewChild('pdfViewer', {static: false}) pdfViewer;

	public id = '';
	public password = '';

	public step = 1;

	public submitted = false;
	public generatingPDF = false;
	public displayPDF = false;
	public email = '';
	public emailChanged = false;
	public attachReport = true;
	public revising = false;

	public showScores = false;

	public answers: { [key: string]: any } = {};

	public validationErrors = [];

	public validationScore = 0;
	public reproducibilityScore = 0;

	public steps: { step: number, short: string; title: string; icon: string; }[] = [
		{step: 1, short: 'MD', title: 'Metadata', icon: 'fa-at'},
		{step: 2, short: 'P', title: 'Purpose', icon: 'fa-bullseye-arrow'},
		{step: 3, short: 'D', title: 'Data', icon: 'fa-database'},
		{step: 4, short: 'M', title: 'Method', icon: 'fa-function'},
		{step: 5, short: 'R', title: 'Reproducibility', icon: 'fa-redo'},
	];

	public questions: IQuestion = {
		type: 'complex',
		subs: [
			{
				id: 'MD',
				type: 'complex',
				title: 'Metadata',
				subs: [
					{
						id: '1',
						type: 'string',
						default: '',
						title: 'Title',
						help: 'TestTestTest',
						question: 'Title of the AI.',
						config: {
							minLength: 8,
							maxLength: 128,
						},
					},
					{
						id: '2',
						type: 'string',
						default: '',
						title: 'Short Title',
						question: 'Short title of the AI.',
						config: {
							minLength: 2,
							maxLength: 32,
						},
					},
					{
						id: '3',
						type: 'tags',
						default: [],
						title: 'Keywords',
						question: 'Keywords relevant for the AI.',
						config: {
							allowCustom: true,
							options: [
								{key: 'tag1', value: 'Tag 1'},
								{key: 'tag2', value: 'Tag 2'},
							],
							minLength: 2,
							maxLength: 10,
						},
					},
					{
						id: '4',
						type: 'list',
						title: 'Contact',
						sub: {
							type: 'complex',
							title: 'Contact',
							subs: [
								{
									id: '1',
									type: 'string',
									title: 'Name',
									question: 'Name of the author.',
									default: ''
								},
								{
									id: '2',
									type: 'string',
									title: 'Institution',
									question: 'Name of the institution.',
									default: ''
								},
								{
									id: '3',
									type: 'string',
									title: 'Email',
									question: 'Email address of the author.',
									default: '',
									config: {
										inputType: 'email',
									},
								},
								{
									id: '4',
									type: 'string',
									default: '',
									optional: true,
									title: 'ORCID iD',
									question: 'ORCID iD of the author.',
								},
							],
						},
					},
					{
						id: '5',
						type: 'list',
						title: 'Funding',
						question: 'Funding details relevant for the AI.',
						sub: {
							type: 'text',
							default: '',
							title: 'Funding',
							question: 'Funding details relevant for the AI.',
						},
					},
					{
						id: '6',
						type: 'boolean',
						default: false,
						title: 'Appear in search',
						question: 'Specify whether the AI should appear in the search.',
					},
				]
			},
			{
				id: 'P', type: 'complex', title: 'Purpose', question: '', subs: [
					{
						id: '1',
						type: 'text',
						default: '',
						title: 'Purpose',
						question: 'What is your AI designed to learn or predict?',
					},
					{
						id: '2',
						type: 'complex',
						subs: [
							{
								id: '1',
								type: 'boolean',
								default: false,
								title: 'Predicts surrogate marker',
								question: 'Does your AI predict a surrogate marker?',
							},
							{
								id: '2',
								type: 'text',
								default: '',
								condition: (val: any) => val['1'] === true,
								title: 'Information about surrogate marker',
								question: 'More detailed information about the surrogate marker.',
							},
						]
					},
					{
						id: '3',
						type: 'complex',
						title: 'AI category',
						question: 'To which category does your AI problem belong?',
						subs: [
							{
								id: '1',
								type: 'select',
								title: 'Category',
								question: 'To which category does your AI problem belong?',
								config: {
									allowCustom: false,
									options: [
										{key: 'cf', value: 'Classification'},
										{key: 'ce', value: 'Continuous estimation'},
										{key: 'cl', value: 'Clustering'},
										{key: 'dr', value: 'Dimensionality reduction'},
										{key: 'ad', value: 'Anomaly detection'},
										{key: 'rr', value: 'Ranking / Recommendation'},
										{key: 'dg', value: 'Data generation'},
										{key: 'other', value: 'Other'},
									],
								},
							},
							{
								id: '2',
								type: 'text',
								default: '',
								condition: (val: any) => val['1'] === 'other',
								title: 'Category',
								question: 'More detailed information',
							},
						]
					},
				]
			},
			{
				id: 'D',
				type: 'list',
				title: 'Dataset',
				sub: {
					type: 'complex',
					title: 'Title',
					question: 'Title of the AI',
					subs: [
						{
							id: '1',
							type: 'text',
							default: '',
							title: 'Information about the data',
							question: 'What is the type of the data and how was it generated or obtained?',
						},
						{
							id: '2',
							type: 'complex',
							subs: [
								{
									id: '1',
									type: 'radio',
									default: 'Real',
									question: 'Is the data real or simulated?',
									config: {
										options: [
											{key: 'r', value: 'Real'},
											{key: 's', value: 'Simulated'},
										],
									},
								},
								{
									id: '2',
									condition: (val: any) => val['1'] === 'Simulated',
									type: 'text',
									default: '',
									title: 'Information about simulated data',
									question: 'How was the data simulated?',
								},
							],
						},
					]
				},
			},
			{
				id: 'M',
				type: 'complex',
				title: 'Method',
				subs: [
					{
						id: '1',
						type: 'text',
						default: '',
						title: 'AI or mathematical methods',
						question: 'Which AI or mathematical methods did you use and how did you select them?',
					},
					{
						id: '2',
						type: 'radio',
						default: 'default',
						title: 'Hyper-parameters',
						question: 'How did you select your method’s hyper-parameters?',
						config: {
							options: [
								{key: 'default', value: 'Default'},
								{key: 'hpt', value: 'Hyper-parameter tuning'},
								{key: 'na', value: 'Doesn\'t apply'},
							],
						},
						scores: {
							validation: (val: any) => {
								if (val === 'Hyper-parameter tuning' || val === 'Doesn\'t apply') {
									return 1;
								}
								return 0;
							}
						}
					},
					{
						id: '3',
						type: 'complex',
						subs: [
							{
								id: '1',
								type: 'checkboxes',
								default: [],
								title: 'Test metrics',
								question: 'Which test metrics do you report?',
								config: {
									options: [
										{key: 'acc', value: 'Accuracy'},
										{key: 'pc', value: 'Precision'},
										{key: 'rc', value: 'Recall'},
										{key: 'cm', value: 'Confusion matrix'},
										{key: 'f1', value: 'F1-score'},
										{key: 'l', value: 'Loss'},
										{key: 'auc', value: 'AUC (area under curve)'},
										{key: 'me', value: 'MAE/MSE (mean absolute/square error)'},
										{key: 'gini', value: 'Gini coefficient'},
										{key: 'rt', value: 'Runtime'},
										{key: 'sa', value: 'Sensitivity analysis'},
										{key: 'other', value: 'Other'},
									],
								},
							},
							{
								id: '2',
								condition: (val: any) => val['1'].find((o) => o.value === 'other'),
								type: 'text',
								default: '',
								title: 'Additional test metrics',
								question: 'Which additional metrics do you report?',
							},
						]
					},
				],
			},
			{
				id: 'R',
				type: 'complex',
				title: 'Reproducibility',
				subs: [
					{
						id: '1',
						type: 'complex',
						subs: [
							{
								id: '1',
								type: 'radio',
								default: 'no',
								question: 'Do you provide all means (including dependencies) to easily re-run your AI?',
								config: {
									options: [
										{key: 'no', value: 'No'},
										{key: 'yes', value: 'Yes'},
									],
								}
							},
							{
								id: '2',
								condition: (val: any) => val['1'].value === 'yes',
								type: 'checkboxes',
								default: [],
								question: 'Which means for re-running your AI do you provide?',
								config: {
									options: [
										{key: 'docker', value: 'Dockerfile'},
										{key: 'build', value: 'Build system files'},
										{key: 'readme', value: 'Detailed README'},
										{key: 'other', value: 'Other'},
									]
								}
							},
							{
								id: '3',
								condition: (val: any) => val['1'].value === 'yes' && val['2'].find((o) => o.value === 'other'),
								type: 'text',
								default: '',
								title: 'Elaboration on means to re-run AI',
								question: 'Elaborate on additional means you provide.',
							}
						]
					}
				],
			},
		]
	};

	constructor(private http: HttpClient, private route: ActivatedRoute) {
	}

	public ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.password = params.p;

			// if (this.id) {
			//   this.http.get<IQuestionnaire>(`${environment.url}api/questionnaire?id=${this.id}`).subscribe((resp) => {
			//     this.questionnaire = expandQuestionnaireFields(resp);
			//     this.revising = true;
			//   });
			// }
		});

		this.createDefaults();
	}

	public getSection(s: string): IQuestion {
		for (const q of this.questions.subs) {
			if (q.id === s) {
				return q;
			}
		}
	}

	public createDefaults() {
		this.answers = createDefaults(this.questions);
	}

	// public updateEmail() {
	//   if (this.emailChanged) {
	//     // In this case, the author already has entered something. We don't want to override this.
	//     return;
	//   }
	//   this.email = this.questionnaire.authorEmail;
	// }

	public async goToStep(step: number) {
		this.step = Number(step);

		if (this.step === 6) {
			this.showScores = true;
			this.updateFields();
			if (this.validationErrors.length === 0) {
				await this.generatePreview();
			}
		}
	}

	public async submitQuestionnaire() {
		// this.submitted = true;
		// if (this.id && this.password) {
		//   this.http.post<any>(`${environment.url}api/questionnaire?id=${this.id}&p=${this.password}`, {
		//     questionnaire: this.questionnaire,
		//   }).subscribe((r) => {
		//     this.id = r.id;
		//     this.password = r.password;
		//   });
		// } else {
		//   this.http.post<any>(`${environment.url}api/questionnaire`, {
		//     questionnaire: this.questionnaire,
		//     attachReport: this.attachReport,
		//     email: this.email,
		//   }).subscribe((r) => {
		//     this.id = r.id;
		//     this.password = r.password;
		//   });
		// }
	}

	public async generatePreview() {
		// this.displayPDF = false;
		// this.generatingPDF = true;
		// this.http
		//   .post(`${environment.url}api/preview`, JSON.stringify(this.questionnaire), {responseType: 'blob'})
		//   .pipe(map((result: any) => {
		//     return result;
		//   }))
		//   .subscribe((res) => {
		//     this.generatingPDF = false;
		//     this.pdfViewer.pdfSrc = res;
		//     this.pdfViewer.refresh();
		//     this.displayPDF = true;
		//   });
	}

	public goToField(id: string) {
		const ids = id.split('.');
		for (const s of this.steps) {
			if (s.short === ids[0]) {
				this.step = s.step;
			}
		}
	}

	public checkFields(): any[] {
		return [];
		// const missingFields: MissingField[] = [];
		//
		// return missingFields;
	}

	public validate() {
		this.validationErrors = validateRec('', this.questions, this.answers);
	}

	public calcScores() {
		this.validationScore = score(this.questions, this.answers, 'validation') /
			maxScore(this.questions, this.answers, 'validation');
		this.reproducibilityScore = score(this.questions, this.answers, 'reproducibility') /
			maxScore(this.questions, this.answers, 'reproducibility');
	}

	public updateFields() {
		this.validate();
		this.calcScores();
	}

}
