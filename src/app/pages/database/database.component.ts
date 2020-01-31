import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IReport} from '../../interfaces';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

interface IResults {
  count: number;
  results: IReport[];
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  public results: IReport[] = [];
  public resultsCount = 0;
  public lastQuery = '';
  public query = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.query.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(() => {
        this.search();
      });
  }

  ngOnInit() {
    this.search();
  }

  public search() {
    this.http.get<any>(`/api/search?q=${escape(this.query.getValue())}`).subscribe((resp) => {
      this.resultsCount = resp.count;
      this.results = resp.results.map((result) => {
        result.date = new Date(result.date);
        result.revisions = result.revisions.map((revision) => {
          revision.date = new Date(revision.date);
          return revision;
        });
        return result;
      });
      this.lastQuery = resp.query;
    });
  }

}
