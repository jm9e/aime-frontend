import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { createDefaults, validate, IQuestion } from '../../interfaces';

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

	public valid?: boolean;
	public validMessage = '';

	public fullId = '';

	public searchQ = '';

	public expanded = false;

	constructor() {
	}

	ngOnInit() {
		if (this.idPrefix && this.id) {
			this.fullId = this.idPrefix + '.' + this.id;
		} else {
			this.fullId = this.idPrefix + this.id;
		}
	}

	public getResults(): [string, string][] {
		const results: [string, string][] = [];
		for (const e of this.question.config.options) {
			if (e.value.toLowerCase().indexOf(this.searchQ.toLowerCase()) !== -1) {
				results.push(e);
			}
		}
		return results;
	}

	public addTag(value: string, custom: boolean) {
		if (!this.value) {
			this.value = [];
		}

		console.log(value, custom);
		if (this.hasValue(value, custom)) {
			return;
		}

		this.value.push({
			custom,
			value,
		});
		this.valueChange.emit(this.value);
		this.searchQ = '';

		this.validate();
	}

	public setOption(value: string | undefined, custom: boolean) {
		if (typeof value === 'undefined') {
			this.value = undefined;
		}

		this.value = {
			custom,
			value,
		};
		this.valueChange.emit(this.value);
		this.searchQ = '';

		this.validate();
	}

	public getValue(value: string, custom: boolean): string | undefined {
		if (custom) {
			return value;
		}
		const entry = this.question.config.options.find((e) => e.key === value);
		if (typeof entry === 'undefined') {
			return undefined;
		}
		return entry.value;
	}

	public hasValue(value: string, custom: boolean): boolean {
		if (typeof this.value === 'undefined') {
			return false;
		}

		if (custom) {
			const entry = this.value.find((e) => (e.custom && e.value === value) || (!e.custom && this.getValue(e.value, false) === value));
			return typeof entry !== 'undefined';
		} else {
			const entry = this.value.find((e) => (e.custom && this.getValue(value, false) === e.value) || (!e.custom && e.value === value));
			return typeof entry !== 'undefined';
		}
	}

	public deleteTag(value: string, custom: boolean) {
		if (!this.value) {
			this.value = [];
		}

		const newTags = [];

		for (const ot of this.value) {
			if (ot.custom !== custom || ot.value !== value) {
				newTags.push(ot);
			}
		}

		this.value = newTags;
		this.valueChange.emit(this.value);
		this.searchQ = '';

		this.validate();
	}

	public addEntry() {
		this.value.push(createDefaults(this.question.sub));
		this.validate();
	}

	public deleteEntry(i: number) {
		this.value.splice(i, 1);
		this.validate();
	}

	public trackByFn(index: any, item: any) {
		return index;
	}

	public validate() {
		const {valid, msg} = validate(this.question, this.value);
		this.valid = valid;
		this.validMessage = msg;
	}

}
