import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReport } from '../../interfaces';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  public results: IReport[] = [];
  public resultsCount: number | null = null;
  public lastQuery = '';
  public query = new BehaviorSubject<string>('');
  public searchMetadata = true;
  public searchPurpose = true;
  public searchData = true;
  public searchMethod = true;
  public searchReproducibility = true;
  public reportCited: IReport | null = null;
  public expanded: { [key: string]: any } = {};
  public currentPage = 0;
  public pages: number[] = [];
  private ITEMS_PER_PAGE = 3;

  constructor(private http: HttpClient) {
    this.query.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(() => {
        this.search();
      });
  }

  ngOnInit() {
  }

  private getFields(): string {
    let fields = '';
    fields += this.searchMetadata ? '1' : '0';
    fields += ',';
    fields += this.searchPurpose ? '1' : '0';
    fields += ',';
    fields += this.searchData ? '1' : '0';
    fields += ',';
    fields += this.searchMethod ? '1' : '0';
    fields += ',';
    fields += this.searchReproducibility ? '1' : '0';
    fields += ',';
    return fields;
  }

  public search(offset = 0) {
    this.http.get<any>(
      `/api/search?q=${escape(this.query.getValue())}&f=${this.getFields()}&o=${offset}&l=${this.ITEMS_PER_PAGE}`)
      .subscribe((resp) => {
        this.resultsCount = resp.count;
        this.results = resp.results.map((result) => {
          result.date = new Date(result.date);
          result.versions = result.versions.map((revision) => {
            revision.date = new Date(revision.date);
            return revision;
          });
          return result;
        });
        this.lastQuery = resp.query;
        this.currentPage = 0;
        this.pages = Array(Math.ceil(this.resultsCount / this.ITEMS_PER_PAGE)).fill(0).map((x, i) => i);
        this.expanded = {};
      });
  }

  public setPage(i) {
    this.search(i * this.ITEMS_PER_PAGE);
    this.currentPage = i;
  }

}
