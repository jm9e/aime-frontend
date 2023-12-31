import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import YAML from 'yaml';
import {IIssueReference, IQuestion, parseQuestions} from '../../interfaces';
import {MetaService} from '../../services/meta.service';

@Component({
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

	public id = '';
	public revision = 0;
	public revisions: { createdAt: Date, revision: number }[] = [];
	public issues: { id: number, revisionId: number, createdAt: Date, name: string, type: number }[] = [];
	public targetVersion = 0;
	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};
	public answers = {};
	public error = false;
	public raiseIssue?: IIssueReference;
	public spec?: string;

	public issueName = '';
	public issueEmail = '';
	public issueContent = '';
	public issueSubmitted = false;

	constructor(private meta: MetaService, private http: HttpClient, private route: ActivatedRoute) {
		meta.setTitle('Report');
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.id = params.id;
			this.targetVersion = params.version ?? 0;

			if (typeof this.id !== 'undefined') {
				this.load();
			}
		});
	}

	public load() {
		if (this.targetVersion === 0) {
			this.http.get<any>(`${environment.api}report/${this.id}`).subscribe((data) => {
				this.answers = data.answers;
				this.revision = data.revision;
				this.revisions = data.revisions ?? [];
				this.issues = data.issues ?? [];
				this.meta.setTitle(`Report ${this.id}`);
				this.spec = data.version;
				this.loadQuestions();
			}, () => {
				this.error = true;
			});
		} else {
			this.http.get<any>(`${environment.api}report/${this.id}/${this.targetVersion}`).subscribe((data) => {
				this.answers = data.answers;
				this.revision = data.revision;
				this.revisions = data.revisions ?? [];
				this.issues = data.issues ?? [];
				this.meta.setTitle(`Report ${this.id} / Version ${this.targetVersion}`);
				this.spec = data.version;
				this.loadQuestions();
			}, () => {
				this.error = true;
			});
		}
	}

	private loadQuestions() {
		if (this.spec === '2023.0') {
			this.http.get('assets/questionnaire_2023.yaml', {
				responseType: 'text',
			}).subscribe(data => {
				this.yamlSpec = data;
				this.initQuestions();
			});
		} else if (this.spec === '2021.0') {
			this.http.get('assets/questionnaire_2021.yaml', {
				responseType: 'text',
			}).subscribe(data => {
				this.yamlSpec = data;
				this.initQuestions();
			});
		} else {
			throw new Error(`invalid version ${this.spec}`);
		}
	}

	public initQuestions() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
	}

	public submitComment() {
		this.issueSubmitted = true;

		this.http.post<any>(`${environment.api}report/${this.id}/issue`, {
			name: this.issueName,
			email: this.issueEmail,
			field: this.raiseIssue.field,
			content: this.issueContent,
			type: 0,
		}).subscribe(() => {
			this.issueContent = '';
		}, () => {
		});
	}

}
