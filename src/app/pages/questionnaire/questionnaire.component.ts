import {Component, OnInit, ViewChild} from '@angular/core';
import {createDataset, createQuestionnaire, IQuestionnaire} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

  @ViewChild('pdfViewer', {static: false}) pdfViewer;

  public step = 1;
  public questionnaire = createQuestionnaire();
  public submitted = false;
  public id = '';
  public password = '';
  public generatingPDF = false;
  public displayPDF = false;
  public email = '';
  public attachReport = true;
  public revising = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.password = params.p;

      if (this.id) {
        this.http.get<IQuestionnaire>(`/api/questionnaire?id=${this.id}`).subscribe((resp) => {
          this.questionnaire = resp;
          this.revising = true;
        });
      }
    });
  }

  public stepComplete(step: number): boolean {
    return true;
  }

  public completeUntil(until: number): boolean {
    for (let i = 0; i < until; i++) {
      if (!this.stepComplete(i)) {
        return false;
      }
    }
    return true;
  }

  public async goToStep(step: number) {
    if (!this.completeUntil(step - 1)) {
      return;
    }
    this.step = step;

    if (this.step === 6) {
      await this.generatePreview();
    }
  }

  public addDataset() {
    this.questionnaire.datasets.push(createDataset());
  }

  public removeDataset(i) {
    this.questionnaire.datasets.splice(i, 1);
  }

  public async submitQuestionnaire() {
    this.submitted = true;
    if (this.id && this.password) {
      this.http.post<any>(`/api/questionnaire?id=${this.id}&p=${this.password}`, {
        questionnaire: this.questionnaire,
      }).subscribe((r) => {
        this.id = r.id;
        this.password = r.password;
      });
    } else {
      this.http.post<any>(`/api/questionnaire`, {
        questionnaire: this.questionnaire,
        attachReport: this.attachReport,
        email: this.email,
      }).subscribe((r) => {
        this.id = r.id;
        this.password = r.password;
      });
    }
  }

  public async generatePreview() {
    this.displayPDF = false;
    this.generatingPDF = true;
    this.http
      .post(`/api/preview`, JSON.stringify(this.questionnaire), {responseType: 'blob'})
      .pipe(map((result: any) => {
        return result;
      }))
      .subscribe((res) => {
        this.generatingPDF = false;
        this.pdfViewer.pdfSrc = res;
        this.pdfViewer.refresh();
        this.displayPDF = true;
      });
  }

}
