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
	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};
	public answers = {};

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

			if (typeof this.id !== 'undefined') {
				this.load();
			}
		});
	}

	public load() {
		this.http.get<any>(`${environment.url}report/${this.id}`).subscribe((data) => {
			this.answers = data.answers;
		});
	}

	public initQuestions() {
		const jsonSpec = YAML.parse(this.yamlSpec, {});
		this.questions = parseQuestions(jsonSpec);
	}

}
