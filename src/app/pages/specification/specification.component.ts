import {Component, OnInit} from '@angular/core';
import {IQuestion, parseQuestions} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import YAML from 'yaml';
import {MetaService} from "../../services/meta.service";

@Component({
	templateUrl: './specification.component.html',
	styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit {

	public yamlSpec = '';
	public questions: IQuestion = {type: 'complex', children: []};

	public showTree = true;
	public showSpec = true;

	constructor(private meta: MetaService, private http: HttpClient) {
		meta.setTitle('Specification');
		this.http.get('assets/questionnaire.yaml', {
			responseType: 'text',
		}).subscribe(data => {
			this.yamlSpec = data;
			const jsonSpec = YAML.parse(this.yamlSpec, {});
			this.questions = parseQuestions(jsonSpec);
		});
	}

	ngOnInit(): void {
	}

}
