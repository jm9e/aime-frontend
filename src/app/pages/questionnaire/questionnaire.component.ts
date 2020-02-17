import {Component, OnInit, ViewChild} from '@angular/core';
import {createDataset, createQuestionnaire, IDataset, IQuestionnaire} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

interface MissingField {
  step: number;
  id: string;
  name: string;
}

function expandDatasetFields(dataset: IDataset) {
  dataset.fieldExpanded = {};

  dataset.fieldExpanded['D.4'] = !!dataset.availability;
  dataset.fieldExpanded['D.6'] = !!dataset.bias;
  dataset.fieldExpanded['D.7'] = !!dataset.biasAddressed;
  dataset.fieldExpanded['D.9'] = !!dataset.normalized;
  dataset.fieldExpanded['D.10'] = !!dataset.preprocessing;
}

function expandQuestionnaireFields(questionnaire: IQuestionnaire): IQuestionnaire {
  questionnaire.fieldExpanded = {};

  questionnaire.fieldExpanded['P.2'] = !!questionnaire.surrogate;

  questionnaire.fieldExpanded['M.2'] = !!questionnaire.hyperparameters;
  questionnaire.fieldExpanded['M.7'] = !!questionnaire.reproducibility;
  questionnaire.fieldExpanded['M.8'] = !!questionnaire.randomBaseline;
  questionnaire.fieldExpanded['M.9'] = !!questionnaire.stateOfTheArt;

  questionnaire.fieldExpanded['R.2'] = !!questionnaire.sourceCode;
  questionnaire.fieldExpanded['R.5'] = !!questionnaire.highPerformance;

  questionnaire.datasets.forEach(ds => expandDatasetFields(ds));

  return questionnaire;
}

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
  public missingFields: MissingField[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.password = params.p;

      if (this.id) {
        this.http.get<IQuestionnaire>(`/api/questionnaire?id=${this.id}`).subscribe((resp) => {
          this.questionnaire = expandQuestionnaireFields(resp);
          this.revising = true;
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

  public async goToStep(step: number) {
    this.step = Number(step);

    if (this.step === 6) {
      this.missingFields = this.checkFields();
      if (this.missingFields.length === 0) {
        await this.generatePreview();
      }
    }
  }

  public addDataset() {
    this.questionnaire.datasets.push(createDataset());
  }

  public removeDataset(i) {
    this.questionnaire.datasets.splice(i, 1);
  }

  public isFalse(v: boolean | null): boolean {
    console.log(v);
    console.log(v === false);
    return v === false;
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

  public checkFields(): MissingField[] {
    const missingFields: MissingField[] = [];

    // Metadata
    if (!this.questionnaire.title) {
      missingFields.push({step: 1, id: 'MD.1', name: 'Title of the AI.'});
    }
    if (!this.questionnaire.description) {
      missingFields.push({step: 1, id: 'MD.2', name: 'Short description of the AI.'});
    }
    if (!this.questionnaire.authorName) {
      missingFields.push({step: 1, id: 'MD.3a', name: 'Author name.'});
    }
    if (!this.questionnaire.authorAddress) {
      missingFields.push({step: 1, id: 'MD.3b', name: 'Institutional address.'});
    }
    if (!this.questionnaire.authorEmail) {
      missingFields.push({step: 1, id: 'MD.3c', name: 'Email address.'});
    }

    // Purpose
    if (!this.questionnaire.purpose) {
      missingFields.push({step: 2, id: 'P.1', name: 'What is your AI designed to learn or predict?'});
    }
    if (this.questionnaire.fieldExpanded['P.2'] && !this.questionnaire.surrogate) {
      missingFields.push({step: 2, id: 'P.2', name: 'What does your surrogate marker represent?'});
    }
    if (!this.questionnaire.category) {
      missingFields.push({step: 2, id: 'P.3', name: 'To which category does your AI problem belong?'});
    }

    // Datasets
    for (let i = 0; i < this.questionnaire.datasets.length; i++) {
      const ds = this.questionnaire.datasets[i];

      if (!ds.type) {
        missingFields.push({step: 3, id: `D${i + 1}.2`, name: 'What is the type of the data?'});
      }
      if (ds.synthetic === 'synthetic' && !ds.syntheticAvailable) {
        missingFields.push({step: 3, id: `D${i + 1}.3`, name: 'Is your simulator publicly available and, if so, where?'});
      }
      if (ds.fieldExpanded['D.4'] && !ds.availability) {
        missingFields.push({step: 3, id: `D${i + 1}.4`, name: 'Where can your data be found?'});
      }
      if (ds.fieldExpanded['D.6'] && !ds.bias) {
        missingFields.push({step: 3, id: `D${i + 1}.6`, name: 'Which biases is your data subject to?'});
      }
      if (ds.fieldExpanded['D.7'] && !ds.biasAddressed) {
        missingFields.push({step: 3, id: `D${i + 1}.7`, name: 'How did you address your data biases?'});
      }
      if (!ds.samples) {
        missingFields.push({step: 3, id: `D${i + 1}.8a`, name: 'How many samples do you have?'});
      }
      if (!ds.features) {
        missingFields.push({step: 3, id: `D${i + 1}.8b`, name: 'How many features do you have?'});
      }
      if (ds.fieldExpanded['D.9'] && !ds.normalized) {
        missingFields.push({step: 3, id: `D${i + 1}.9`, name: 'How did you normalize your data?'});
      }
      if (ds.fieldExpanded['D.10'] && !ds.preprocessing) {
        missingFields.push({step: 3, id: `D${i + 1}.10`, name: 'How did you preprocess your data?'});
      }
    }

    // Method
    if (!this.questionnaire.method) {
      missingFields.push({step: 4, id: 'M.1', name: 'Which AI method did you use?'});
    }
    if (this.questionnaire.fieldExpanded['M.2'] && !this.questionnaire.hyperparameters) {
      missingFields.push({step: 4, id: 'M.2', name: 'Which hyper-parameters did you employ and how did you select them?'});
    }
    if (!this.questionnaire.testMetrics) {
      missingFields.push({step: 4, id: 'M.3', name: 'Which test metrics do you report?'});
    }
    if (!this.questionnaire.overfitting) {
      missingFields.push({step: 4, id: 'M.4', name: 'How do you prevent overfitting?'});
    }
    if (!this.questionnaire.validation) {
      missingFields.push({step: 4, id: 'M.5', name: 'Did you validate your method on independent data, e.g. from a different cohort?'});
    }
    if (!this.questionnaire.confoundingFactors) {
      missingFields.push({step: 4, id: 'M.6', name: 'Did you check if your AI model is affected by confounding factors?'});
    }
    if (this.questionnaire.fieldExpanded['M.7'] && !this.questionnaire.reproducibility) {
      missingFields.push({step: 4, id: 'M.7', name: 'How did you check whether your results are reproducible?'});
    }
    if (this.questionnaire.fieldExpanded['M.8'] && !this.questionnaire.randomBaseline) {
      missingFields.push({step: 4, id: 'M.8', name: 'How did you compare against a random baseline model?'});
    }
    if (this.questionnaire.fieldExpanded['M.9'] && !this.questionnaire.stateOfTheArt) {
      missingFields.push({step: 4, id: 'M.9', name: 'Against which state of the art approaches did you compare against?'});
    }

    // Reproducibility
    if (this.questionnaire.fieldExpanded['R.1'] && !this.questionnaire.availability) {
      missingFields.push({step: 5, id: 'R.1', name: 'Where can your tool be found?'});
    }
    if (this.questionnaire.fieldExpanded['R.2'] && !this.questionnaire.sourceCode) {
      missingFields.push({step: 5, id: 'R.2', name: 'Where can your source code be found?'});
    }
    if (!this.questionnaire.dependencies) {
      missingFields.push({step: 5, id: 'R.3', name: 'How did you report on your dependencies?'});
    }
    if (!this.questionnaire.operatingSystem) {
      missingFields.push({step: 5, id: 'R.4a', name: 'On which operating system(s) did you run your analysis?'});
    }
    if (!this.questionnaire.hardwareSpecs) {
      missingFields.push({step: 5, id: 'R.4b', name: 'On which hardware did you run your analysis?'});
    }
    if (this.questionnaire.fieldExpanded['R.5'] && !this.questionnaire.highPerformance) {
      missingFields.push({step: 5, id: 'R.5', name: 'Why does your AI require high-performance computing?'});
    }

    return missingFields;
  }

}
