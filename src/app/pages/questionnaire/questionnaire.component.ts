import {Component, EventEmitter, OnInit} from '@angular/core';
import {IQuestion, createDefaults, validateRec, parseQuestions, getter} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import YAML from 'yaml';
import {MetaService} from '../../services/meta.service';

@Component({
	templateUrl: './questionnaire.component.html',
	styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

	public id = '';
	public password = '';

	public yamlSpec = '';

	public step = 1;

	public submitted = false;
	public email = '';
	public emailChanged = false;
	public attachReport = true;
	public revising = false;
	public version = 0;
	public isPublic = true;
	public spec = '';

	public answers: { [key: string]: any } = {};

	public validationErrors = [];

	public validationTrigger = new EventEmitter<void>();

	public composing = true;

	public sections: {[_: string]: boolean} = { PR: false, EP: false };

	public stepsAvailable: {[_: string]: { title: string; icon: string; }} = {
		PR: {title: 'Privacy', icon: 'fa-mask'},
		EP: {title: 'Epistasis', icon: 'fa-dna'},
	};

	public mandatorySteps: { step: number, short: string; title: string; icon: string; }[] = [
		{step: 1, short: 'MD', title: 'Metadata', icon: 'fa-at'},
		{step: 2, short: 'P', title: 'Purpose', icon: 'fa-bullseye-arrow'},
		{step: 3, short: 'D', title: 'Data', icon: 'fa-database'},
		{step: 4, short: 'M', title: 'Method', icon: 'fa-function'},
		{step: 5, short: 'R', title: 'Reproducibility', icon: 'fa-redo'},
	];

	public steps: { step: number, short: string; title: string; icon: string; }[] = [];

	public lastStep = this.steps.length + 1;

	public questions: IQuestion = {type: 'complex', children: []};

	public getter = (id: string) => {
		return getter(this.questions, this.answers, id.split('.'));
	};

	constructor(private meta: MetaService, private http: HttpClient, private route: ActivatedRoute) {
		meta.setTitle('New report');
	}

	public ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.id = params.id;
			this.password = params.p;

			if (this.id && this.password) {
				this.http.get<any>(`${environment.api}report/${this.id}`).subscribe((resp) => {
					this.answers = resp.answers;
					this.isPublic = resp.public;
					this.revising = true;
					this.spec = resp.version;
					this.loadQuestions();
				});
			} else {
				this.spec = '2023.0';
				this.loadQuestions();
			}
		});
	}

	private loadQuestions() {
		if (this.spec === '2023.0') {
			this.http.get('assets/questionnaire_2023.yaml', {
				responseType: 'text',
			}).subscribe(data => {
				this.yamlSpec = data;
				this.reloadQuestionnaire();
			});
		} else if (this.spec === '2021.0') {
			this.http.get('assets/questionnaire_2021.yaml', {
				responseType: 'text',
			}).subscribe(data => {
				this.yamlSpec = data;
				this.reloadQuestionnaire();
			});
		} else {
			throw new Error(`invalid version ${this.version}`);
		}
	}

	public compose(skip = false) {
		this.steps = JSON.parse(JSON.stringify(this.mandatorySteps));
		if (!skip) {
			for (const key of Object.keys(this.sections)) {
				if (this.sections[key]) {
					this.steps.push({
						step: this.steps.length + 1,
						short: key, title: this.stepsAvailable[key].title,
						icon: this.stepsAvailable[key].icon,
					});
				}
			}
		}
		this.lastStep = this.steps.length + 1;
		this.composing = false;
	}

	public reloadQuestionnaire() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
		if (!this.revising) {
			const draft = localStorage.getItem('draft');
			if (draft) {
				this.answers = JSON.parse(draft);
			} else {
				this.createDefaults();
			}
		}
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

		if (this.step === this.lastStep) {
			this.updateFields();
			if (this.validationErrors.length === 0) {
				// TODO
			}
		}

		window.scroll(0, 0);
	}

	public async submitReport() {
		this.submitted = true;
		if (this.id && this.password) {
			this.http.put<any>(`${environment.api}report/${this.id}`, {
				answers: this.answers,
				attachReport: this.attachReport,
				email: this.email,
				password: this.password,
				isPublic: this.isPublic,
			}).subscribe((r) => {
				this.id = r.id;
				this.password = r.password;
				this.version = r.version;
			});
		} else {
			this.http.post<any>(`${environment.api}report`, {
				answers: this.answers,
				attachReport: this.attachReport,
				email: this.email,
				isPublic: this.isPublic,
			}).subscribe((r) => {
				this.id = r.id;
				this.password = r.password;
				this.version = r.version;
			});
		}
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
		this.validationErrors = validateRec('', this.questions, this.answers, this.getter);
	}

	public updateFields() {
		this.answers = JSON.parse(JSON.stringify(this.answers));
		this.validate();
	}

	public handleAnswerChange() {
		if (!this.revising) {
			localStorage.setItem('draft', JSON.stringify(this.answers));
		}
		if (this.answers.MD && typeof this.answers.MD['8'] !== 'undefined') {
			this.isPublic = this.answers.MD['8'];
		}
	}

	public reset() {
		if (this.revising) {
			if (this.id && this.password) {
				this.http.get<any>(`${environment.api}report/${this.id}`).subscribe((resp) => {
					this.answers = resp.answers;
					this.revising = true;
				});
			}
		} else {
			localStorage.removeItem('draft');
			this.reloadQuestionnaire();
		}
		this.composing = true;
	}

	public newReport() {
		this.step = 1;
		this.id = '';
		this.password = '';
		this.revising = false;
		this.submitted = false;

		this.reset();
	}

}
