import { Component, OnInit } from '@angular/core';
import { IQuestionnaire } from '../../questionnaire';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

  public step = 1;
  public questionnaire: IQuestionnaire = {
    author: '',
    availability: '',
    category: '',
    confoundingFactors: '',
    datasets: [
      {
        availability: '',
        bias: false,
        biasAddressed: '',
        clinical: '',
        normalized: '',
        preprocessing: '',
        samples: '',
        synthetic: '',
        training: false,
        type: '',
      },
    ],
    dependencies: '',
    description: '',
    highPerformance: '',
    hyperparameters: '',
    method: '',
    operatingSystem: '',
    overfitting: '',
    public: false,
    purpose: '',
    randomBaseline: '',
    reproducibility: '',
    sourceCode: '',
    stateOfTheArt: '',
    surrogate: '',
    testMetrics: '',
    title: '',
    url: '',
    validation: '',
  };
  public submitted = false;
  public id = '';
  public password = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.password = params.p;

      if (this.id) {
        this.http.get<IQuestionnaire>(`/api/questionnaire?id=${this.id}`).subscribe((resp) => {
          this.questionnaire = resp;
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

  public goToStep(step: number) {
    if (!this.completeUntil(step - 1)) {
      return;
    }
    this.step = step;
  }

  public addDataset() {
    this.questionnaire.datasets.push({
      availability: '',
      bias: false,
      biasAddressed: '',
      clinical: '',
      normalized: '',
      preprocessing: '',
      samples: '',
      synthetic: '',
      training: false,
      type: '',
    });
  }

  public removeDataset(i) {
    this.questionnaire.datasets.splice(i, 1);
  }

  public representation() {
    return JSON.stringify(this.questionnaire, null, 2);
  }

  public async submitQuestionnaire() {
    this.submitted = true;
    if (this.id && this.password) {
      this.http.post<any>(`/api/questionnaire?id=${this.id}&p=${this.password}`, this.questionnaire).subscribe((r) => {
        this.id = r.id;
        this.password = r.password;
      });
    } else {
      this.http.post<any>(`/api/questionnaire`, this.questionnaire).subscribe((r) => {
        this.id = r.id;
        this.password = r.password;
      });
    }
  }

}
