import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IIssueReference, IQuestion, maxScore, score} from '../../interfaces';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

	public validationScore?;
	public reproducibilityScore?;
	public privacyScore?;

	@Input()
	public id = '';

	@Input()
	public revision = 0;

	@Input()
	public interactive = false

	public answersI: any;

	@Input()
	public set answers(a: any) {
		this.answersI = a;
		this.calcScores();
	};

	public questionsI: any;

	@Input()
	public set questions(q: IQuestion) {
		if (typeof q === 'undefined') {
			return;
		}
		this.questionsI = q;
		this.calcScores();
	};

	@Output() raiseIssue = new EventEmitter<IIssueReference>();

	constructor() {
	}

	ngOnInit(): void {
	}

	public calcScores() {
		this.validationScore = score(this.questionsI, this.answersI, 'validation') /
			maxScore(this.questionsI, this.answersI, 'validation');
		this.validationScore = Math.floor(this.validationScore * 20) * 5;

		this.reproducibilityScore = score(this.questionsI, this.answersI, 'reproducibility') /
			maxScore(this.questionsI, this.answersI, 'reproducibility');
		this.reproducibilityScore = Math.floor(this.reproducibilityScore * 20) * 5;

		const maxPrivacy = maxScore(this.questionsI, this.answersI, 'privacy');
		if (maxPrivacy > 0) {
			this.privacyScore = score(this.questionsI, this.answersI, 'privacy') / maxPrivacy;
			this.privacyScore = Math.floor(this.privacyScore * 20) * 5;
		} else {
			this.privacyScore = undefined;
		}
	}

}
