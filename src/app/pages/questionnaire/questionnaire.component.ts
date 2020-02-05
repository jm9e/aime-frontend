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
  public emailChanged = false;
  public attachReport = true;
  public revising = false;

  public surrogateTicked = false;

  public dataAvailableTicked = [false];
  public biasTicked = [false];
  public biasAddressedTicked = [false];
  public normalizedTicked = [false];
  public preprocessingTicked = [false];

  public hyperparametersTicked = false;
  public reproducibilityTicked = false;
  public randomBaselineTicked = false;
  public stateOfTheArtTicked = false;

  public availableTicked = false;
  public sourceCodeTicked = false;
  public highperformanceTicked = false;

  public helpExpanded = {};

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

          this.updateCheckboxes();
        });
      }
    });
  }

  public updateEmail() {
    if (this.emailChanged) {
      // In this case, the author already has entered something. We don't want to override this.
      return;
    }
    this.email = this.questionnaire.authorEmail;
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

    this.biasTicked.push(false);
    this.biasAddressedTicked.push(false);
    this.normalizedTicked.push(false);
    this.preprocessingTicked.push(false);
  }

  public removeDataset(i) {
    this.questionnaire.datasets.splice(i, 1);

    this.biasTicked.splice(i, 1);
    this.biasAddressedTicked.splice(i, 1);
    this.normalizedTicked.splice(i, 1);
    this.preprocessingTicked.splice(i, 1);
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

  private updateCheckboxes() {
    this.surrogateTicked = !!this.questionnaire.surrogate;

    for (let i = 0; i < this.questionnaire.datasets.length; i++) {
      const dataset = this.questionnaire.datasets[i];
      this.dataAvailableTicked[i] = !!dataset.availability;
      this.biasTicked[i] = !!dataset.bias;
      this.biasAddressedTicked[i] = !!dataset.biasAddressed;
      this.normalizedTicked[i] = !!dataset.preprocessing;
      this.preprocessingTicked[i] = !!dataset.bias;
    }

    this.highperformanceTicked = !!this.questionnaire.highPerformance;
    this.reproducibilityTicked = !!this.questionnaire.reproducibility;
    this.randomBaselineTicked = !!this.questionnaire.randomBaseline;
    this.stateOfTheArtTicked = !!this.questionnaire.stateOfTheArt;

    this.availableTicked = !!this.questionnaire.availability;
    this.sourceCodeTicked = !!this.questionnaire.sourceCode;
    this.highperformanceTicked = !!this.questionnaire.highPerformance;
  }

}
