import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {IQuestion, createDefaults, score, validateRec, ScoreType, maxScore, parseQuestions} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {questionnaire} from '../../../questionnaire';
import YAML from 'yaml';

@Component({
	selector: 'app-questionnaire',
	templateUrl: './questionnaire.component.html',
	styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

	public id = '';
	public password = '';

	public showPreview = false;
	public showSpec = false;

	public yamlSpec = '';

	public step = 1;

	public submitted = false;
	public email = '';
	public emailChanged = false;
	public attachReport = true;
	public revising = false;

	public showScores = false;

	public answers: { [key: string]: any } = {};

	public validationErrors = [];

	public validationScore = 0;
	public reproducibilityScore = 0;

	public validationTrigger = new EventEmitter<void>();

	public steps: { step: number, short: string; title: string; icon: string; }[] = [
		{step: 1, short: 'MD', title: 'Metadata', icon: 'fa-at'},
		{step: 2, short: 'P', title: 'Purpose', icon: 'fa-bullseye-arrow'},
		{step: 3, short: 'D', title: 'Data', icon: 'fa-database'},
		{step: 4, short: 'M', title: 'Method', icon: 'fa-function'},
		{step: 5, short: 'R', title: 'Reproducibility', icon: 'fa-redo'},
	];

	public questions: IQuestion = {type: 'complex', children: []};

	constructor(private http: HttpClient, private route: ActivatedRoute) {
		this.http.get('assets/questionnaire.yaml', {
			responseType: 'text',
		}).subscribe(data => {
			this.yamlSpec = data;
			this.reloadQuestionnaire();
		});
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
	}

	public reloadQuestionnaire() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
		this.createDefaults();
	}

	public getSection(s: string): IQuestion {
		for (const q of this.questions.children) {
			if (q.id === s) {
				return q;
			}
		}
		return {type: 'complex'};
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
				// TODO
			}
		}

		window.scroll(0, 0);
	}

	public async submitQuestionnaire() {
		// this.childmitted = true;
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

	public goToField(id: string) {
		const ids = id.split('.');
		for (const s of this.steps) {
			if (s.short === ids[0]) {
				this.step = s.step;
			}
		}
	}

	public validate() {
		this.validationTrigger.next();
		this.validationErrors = validateRec('', this.questions, this.answers);
	}

	public calcScores() {
		this.validationScore = score(this.questions, this.answers, 'validation') /
			maxScore(this.questions, this.answers, 'validation');
		this.reproducibilityScore = score(this.questions, this.answers, 'reproducibility') /
			maxScore(this.questions, this.answers, 'reproducibility');

		this.validationScore = Math.floor(this.validationScore * 20) * 5;
		this.reproducibilityScore = Math.floor(this.reproducibilityScore * 20) * 5;
	}

	public updateFields() {
		this.validate();
		this.calcScores();
	}

}
