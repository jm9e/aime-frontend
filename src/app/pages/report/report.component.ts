import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import YAML from 'yaml';
import {IQuestion, parseQuestions} from '../../interfaces';

@Component({
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

	public id = '';
	public revision = 0;
	public revisions: { createdAt: Date, revision: number }[] = [];
	public targetVersion = 0;
	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};
	public answers = {};
	public error = false;

	constructor(private http: HttpClient, private route: ActivatedRoute) {
		this.http.get('assets/questionnaire.yaml', {
			responseType: 'text',
		}).subscribe(data => {
			this.yamlSpec = data;
			this.initQuestions();
		});
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
				this.revisions = data.revisions;
			}, () => {
				this.error = true;
			});
		} else {
			this.http.get<any>(`${environment.api}report/${this.id}/${this.targetVersion}`).subscribe((data) => {
				this.answers = data.answers;
				this.revision = data.revision;
				this.revisions = data.revisions;
			}, () => {
				this.error = true;
			});
		}
	}

	public initQuestions() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
	}

}
