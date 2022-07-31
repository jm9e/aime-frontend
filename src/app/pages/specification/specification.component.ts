import {Component, OnInit} from '@angular/core';
import {IQuestion, parseQuestions} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import YAML from 'yaml';

@Component({
	templateUrl: './specification.component.html',
	styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit {

	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};

	public showTree = true;
	public showSpec = true;

	public spec = 'questionnaire';

	constructor(private http: HttpClient) {
	}

	async ngOnInit(): Promise<void> {
		await this.switchSpecification();
	}

	async switchSpecification() {
		this.http.get(`assets/${this.spec}.yaml`, {
			responseType: 'text',
		}).subscribe(data => {
			this.yamlSpec = data;
			const jsonSpec = YAML.parse(this.yamlSpec, {});
			this.questions = parseQuestions(jsonSpec);
		});
	}

}
