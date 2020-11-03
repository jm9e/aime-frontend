import {Component, Input, OnInit} from '@angular/core';
import {IQuestion, maxScore, score} from '../../interfaces';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

	public validationScore = 0;
	public reproducibilityScore = 0;

	@Input()
	public id = '';

	@Input()
	public revision = 0;

	public answersI: any;

	@Input()
	public set answers(a: any) {
		this.answersI = a;
		this.calcScores();
	};

	public questionsI: any;

	@Input()
	public set questions(q: IQuestion) {
		this.questionsI = q;
		this.calcScores();
	};

	constructor() {
	}

	ngOnInit(): void {
	}

	public calcScores() {
		this.validationScore = score(this.questionsI, this.answersI, 'validation') /
			maxScore(this.questionsI, this.answersI, 'validation');
		this.reproducibilityScore = score(this.questionsI, this.answersI, 'reproducibility') /
			maxScore(this.questionsI, this.answersI, 'reproducibility');

		this.validationScore = Math.floor(this.validationScore * 20) * 5;
		this.reproducibilityScore = Math.floor(this.reproducibilityScore * 20) * 5;
	}

}
