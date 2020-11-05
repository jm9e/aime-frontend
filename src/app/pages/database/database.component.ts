import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IKeyword, IReport} from '../../interfaces';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
	templateUrl: './database.component.html',
	styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

	public keywords: IKeyword[] = [];

	public sections: {id: string; name: string}[] = [
		{id: 'MD', name: 'Metadata'},
		{id: 'P', name: 'Purpose'},
		{id: 'D', name: 'Data'},
		{id: 'M', name: 'Method'},
		{id: 'R', name: 'Reproducibility'},
	];

	public query = new BehaviorSubject<string>('');
	public keyword = '';

	public results: IReport[] = [];

	public resultsCount: number | null = null;

	public lastQuery = '';
	public lastKeyword = '';

	public sectionsActivated: { [key: string]: boolean } = {};

	public reportCited: IReport | null = null;

	public currentPage = 0;
	public pages: number[] = [];
	private ITEMS_PER_PAGE = 10;

	constructor(private http: HttpClient) {
		for (const s of this.sections) {
			this.sectionsActivated[s.id] = true;
		}

		this.query.pipe(
			debounceTime(300),
			distinctUntilChanged())
			.subscribe(() => {
				this.search();
			});
	}

	ngOnInit() {
		this.http.get<{ keywords: IKeyword[] }>(`${environment.api}keywords`)
			.subscribe((resp) => {
				this.keywords = resp.keywords;
			});
	}

	private getFields(): string {
		let fields = '';
		for (const s of this.sections) {
			if (fields !== '') {
				fields += ',';
			}
			if (this.sectionsActivated[s.id]) {
				fields += s.id;
			}
		}
		return fields;
	}

	public search(page = 0) {
		this.http.get<any>(`${environment.api}search?k=${this.keyword}&q=${escape(this.query.getValue())}&f=${this.getFields()}&o=${page * this.ITEMS_PER_PAGE}&l=${this.ITEMS_PER_PAGE}`)
			.subscribe((resp) => {
				this.resultsCount = resp.count;
				this.results = resp.results as any;
				this.lastQuery = resp.query;
				this.lastKeyword = resp.keyword;

				this.pages = Array(Math.ceil(this.resultsCount / this.ITEMS_PER_PAGE)).fill(0).map((x, i) => i);

				this.currentPage = page;
			});
	}

	public setPage(i) {
		this.search(i);
	}

}
