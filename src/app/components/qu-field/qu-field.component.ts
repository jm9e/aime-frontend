import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {createDefaults, validate, IQuestion} from '../../interfaces';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Component({
	selector: 'app-qu-field',
	templateUrl: './qu-field.component.html',
	styleUrls: ['./qu-field.component.scss']
})
export class QuFieldComponent implements OnInit {

	@Input() readonly: boolean;
	@Input() id: string;
	@Input() question: IQuestion;
	@Input() value: any;
	@Input() idPrefix: string;
	@Input() hideId = false;
	@Input() validationTrigger: EventEmitter<void>;
	@Output() valueChange = new EventEmitter();

	public valid?: boolean;
	public validMessage = '';

	public fullId = '';

	public searchQ = '';

	public expanded = false;

	public showResults = false;

	public uploading = false;

	@ViewChild('fileInput')
	public fileInputRef?: ElementRef<HTMLInputElement>;

	constructor(private http: HttpClient) {
	}

	ngOnInit() {
		if (this.idPrefix && this.id) {
			this.fullId = this.idPrefix + '.' + this.id;
		} else {
			this.fullId = this.idPrefix + this.id;
		}

		this.validationTrigger?.subscribe(() => {
			this.validate();
		});
	}

	public getResults(): [string, string][] {
		const results: [string, string][] = [];
		for (const e of this.question.config.options) {
			if (!this.searchQ || e.value.toLowerCase().indexOf(this.searchQ.toLowerCase()) !== -1) {
				if (!this.hasValue(e.key, false)) {
					results.push(e);
				}
			}
		}
		return results;
	}

	public addTag(value: string, custom: boolean) {
		if (!this.value) {
			this.value = [];
		}

		if (this.hasValue(value, custom)) {
			return;
		}

		this.value.push({
			custom,
			value,
		});
		this.valueChange.emit(this.value);
		this.searchQ = '';
		this.showResults = false;

		this.validate();
	}

	public setOption(value: string | undefined, custom: boolean) {
		if (typeof value === 'undefined') {
			this.value = undefined;
		} else {
			this.value = {
				custom,
				value,
			};
			this.searchQ = '';
			this.showResults = false;
		}

		this.valueChange.emit(this.value);

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

		if (this.question.type === 'tags' || this.question.type === 'checkboxes') {
			if (custom) {
				const entry = this.value.find((e) => (e.custom && e.value === value) || (!e.custom && this.getValue(e.value, false) === value));
				return typeof entry !== 'undefined';
			} else {
				const entry = this.value.find((e) => (e.custom && this.getValue(value, false) === e.value) || (!e.custom && e.value === value));
				return typeof entry !== 'undefined';
			}
		} else if (this.question.type === 'select' || this.question.type === 'radio') {
			if (custom) {
				return (this.value.custom && this.value.value === value) || (!this.value.custom && this.getValue(this.value.value, false) === value);
			} else {
				return (this.value.custom && this.getValue(value, false) === this.value.value) || (!this.value.custom && this.value.value === value);
			}
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
		this.value.push(createDefaults(this.question.child));
		this.valueChange.emit(this.value);
		this.validate();
	}

	public deleteEntry(i: number) {
		this.value.splice(i, 1);
		this.valueChange.emit(this.value);
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

	public blurResults() {
		setTimeout(() => {
			this.showResults = false;
		}, 300);
	}

	public handleFileInput() {
		if (typeof this.fileInputRef === 'undefined') {
			return;
		}

		const files: FileList | null = this.fileInputRef.nativeElement.files;
		if (files === null || files.length !== 1) {
			return;
		}

		this.uploading = true;

		const file = files.item(0);

		this.value = {
			name: file.name,
			file: undefined,
		};

		const reader: FileReader = new FileReader();
		reader.onload = async (): Promise<void> => {
			if (!(reader.result instanceof ArrayBuffer)) {
				return;
			}

			const fileBytes = reader.result;

			this.http.post(`${environment.url}upload`, fileBytes).subscribe((data: any) => {
				this.value.file = data.file;
				this.uploading = false;

				this.valueChange.emit(this.value);
				this.validate();
			}, () => {
				this.value.file = undefined;
				this.uploading = false;

				this.valueChange.emit(this.value);
				this.validate();
			})
		};
		reader.readAsArrayBuffer(file);
	}

	public fileUrl(): string {
		return `${environment.url}documents/${this.value.file}`;
	}

	public removeFile() {
		this.value = undefined;
		this.uploading = false;

		this.valueChange.emit(this.value);
		this.validate();
	}

}
