import { Component, OnInit } from '@angular/core';
import { IQuestionnaire } from '../../questionnaire';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

  public step = 1;
  public stepDone = 1;
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
        clinical: false,
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

  constructor(private http: HttpClient) {
  }

  public ngOnInit() {
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
      clinical: false,
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
    return JSON.stringify(this.questionnaire);
  }

  public async submitQuestionnaire() {
    this.http.post(`/api/questionnaire`, this.questionnaire).subscribe((r) => {
    });
  }

}
