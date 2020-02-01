import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {createQuestionnaire, IReport} from '../../interfaces';
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

  public results: IReport[] = [
    {
      id: 'Test',
      date: new Date(),
      questionnaire: createQuestionnaire(),
      revisions: [],
    }
  ];
  public resultsCount = 1;
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
    this.results[0].questionnaire.title = 'Test 123';
    this.results[0].questionnaire.description = 'Test 123 test 2 354  65';
  }

  public search() {
    this.http.get<any>(`/api/search?q=${escape(this.query.getValue())}`).subscribe((resp) => {
      this.resultsCount = resp.count;
      // this.results = resp.results.map((result) => {
      //   result.date = new Date(result.date);
      //   result.revisions = result.revisions.map((revision) => {
      //     revision.date = new Date(revision.date);
      //     return revision;
      //   });
      //   return result;
      // });
      this.lastQuery = resp.query;
    });
  }

}
