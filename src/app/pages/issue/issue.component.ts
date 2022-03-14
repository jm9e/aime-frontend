import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {IIssue, IQuestion, parseQuestions} from '../../interfaces';
import YAML from 'yaml';
import {MetaService} from "../../services/meta.service";

@Component({
	templateUrl: './issue.component.html',
	styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

	public reportId = '';
	public issueId = 0;
	public password = '';
	public confirm = false;
	public issue?: IIssue;
	public responseContent = '';
	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};

	constructor(private meta: MetaService, private http: HttpClient, private route: ActivatedRoute) {
		meta.setTitle('Issue');
		this.http.get('assets/questionnaire.yaml', {
			responseType: 'text',
		}).subscribe(data => {
			this.yamlSpec = data;
			this.initQuestions();
		});
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.reportId = params.id;
			this.issueId = params.issue;

			if (typeof this.issue !== 'undefined') {
				return;
			}
			if (typeof this.reportId !== 'undefined' && typeof this.issueId !== 'undefined') {
				this.loadIssue();
			}
		});

		this.route.queryParams.subscribe((params) => {
			this.password = params.p;
			this.confirm = params.confirm === '1';

			if (typeof this.issue !== 'undefined') {
				return;
			}
			if (typeof this.password !== 'undefined' && typeof this.reportId !== 'undefined' && typeof this.issueId !== 'undefined') {
				this.loadIssue();
			}
		});
	}

	public loadIssue(p?: string) {
		this.http.get<IIssue>(`${environment.api}report/${this.reportId}/issue/${this.issueId}?p=${this.password}`).subscribe((issue) => {
			this.issue = issue;
			this.meta.setTitle(`Issue ${issue.id} for ${issue.reportId}`);
		}, () => {
		});
	}

	public confirmIssue() {
		this.http.put<IIssue>(
			`${environment.api}report/${this.reportId}/issue/${this.issueId}?p=${this.password}&confirm=1`, {})
			.subscribe(() => {
				this.loadIssue();
			}, () => {
			});
	}

	public initQuestions() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
	}

	public respond() {
		this.http.post<IIssue>(
			`${environment.api}report/${this.reportId}/issue/${this.issueId}?p=${this.password}`, {
				content: this.responseContent,
			})
			.subscribe(() => {
				this.loadIssue();
			}, () => {
			});
	}

}
