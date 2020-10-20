import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IQuestion} from '../../interfaces';

@Component({
	selector: 'app-qu-field',
	templateUrl: './qu-field.component.html',
	styleUrls: ['./qu-field.component.scss']
})
export class QuFieldComponent implements OnInit {

	@Input() id: string;
	@Input() question: IQuestion;
	@Input() value: any;
	@Input() replace: any;
	@Input() idPrefix: string;
	@Input() hideId = false;
	@Output() valueChange = new EventEmitter();

	public searchQ = '';
	public tagResults = [];

	public expanded = false;

	constructor() {
	}

	ngOnInit() {
		if (typeof this.value === 'undefined') {
			this.value = this.question.default;
			this.valueChange.emit(this.value);
		}
	}

	public getResults(): string[] {
		const results: string[] = [];
		for (const t of this.question.config.options) {
			if (t.toLowerCase().indexOf(this.searchQ.toLowerCase()) !== -1) {
				results.push(t);
			}
		}
		return results;
	}

	public addTag(t: string) {
		if (!this.value) {
			this.value = [];
		}

		this.value.push(t);
		this.valueChange.emit(this.value);
		this.searchQ = '';
	}

	public setOption(t: string) {
		this.value = t;
		this.valueChange.emit(this.value);
		this.searchQ = '';
	}

	public deleteTag(t: string) {
		if (!this.value) {
			this.value = [];
		}

		const newTags = [];

		for (const ot of this.value) {
			if (t !== ot) {
				newTags.push(ot);
			}
		}

		this.value = newTags;
		this.valueChange.emit(this.value);
		this.searchQ = '';
	}

	public addEntry() {
		this.value.push(JSON.parse(JSON.stringify(this.question.sub.default)));
		this.valueChange.emit(this.value);
	}

	public deleteEntry(i: number) {
		this.value.splice(i, 1);
		this.valueChange.emit(this.value);
	}

}
