import {Component, OnInit, ViewChild} from '@angular/core';
import {IQuestion, createDefaults} from '../../interfaces';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

  @ViewChild('pdfViewer', {static: false}) pdfViewer;

  public id = '';
  public password = '';

  public step = 1;

  public submitted = false;
  public generatingPDF = false;
  public displayPDF = false;
  public email = '';
  public emailChanged = false;
  public attachReport = true;
  public revising = false;

  public showScores = false;

  public answers: { [key: string]: any } = {};

  public missingFields = [];

  public steps: { step: number, short: string; title: string; icon: string; }[] = [
    {step: 1, short: 'MD', title: 'Metadata', icon: 'fa-at'},
    {step: 2, short: 'P', title: 'Purpose', icon: 'fa-bullseye-arrow'},
    {step: 3, short: 'D', title: 'Data', icon: 'fa-database'},
    {step: 4, short: 'M', title: 'Method', icon: 'fa-function'},
    {step: 5, short: 'R', title: 'Reproducibility', icon: 'fa-redo'},
  ];

  public questions: IQuestion = {
    type: 'complex',
    subs: [
      {
        id: 'MD',
        type: 'complex',
        title: 'Metadata',
        subs: [
          {
            id: '1',
            type: 'string',
            default: '',
            title: 'Title',
            help: 'TestTestTest',
            question: 'Title of the AI.',
          },
          {
            id: '2',
            type: 'text',
            default: '',
            title: 'Short Title',
            question: 'Short title of the AI.',
          },
          {
            id: '3',
            type: 'tags',
            title: 'Keywords',
            question: 'Keywords relevant for the AI.',
            config: {
              allowCustom: true,
              options: [
                'tag1',
                'tag2',
              ],
            },
          },
          {
            id: '4',
            type: 'list',
            title: 'Contact',
            sub: {
              type: 'complex',
              title: 'Contact',
              subs: [
                {
                  id: '1',
                  type: 'string',
                  title: 'Name',
                  question: 'Name of the author.',
                  default: ''
                },
                {
                  id: '2',
                  type: 'string',
                  title: 'Institution',
                  question: 'Name of the institution.',
                  default: ''
                },
                {
                  id: '3',
                  type: 'string',
                  title: 'Email',
                  question: 'Email address of the author.',
                  default: ''
                },
                {
                  id: '4',
                  type: 'string',
                  default: '',
                  optional: true,
                  title: 'ORCID iD',
                  question: 'ORCID iD of the author.',
                },
              ],
            },
          },
          {
            id: '5',
            type: 'list',
            title: 'Funding',
            question: 'Funding details relevant for the AI.',
            sub: {
              type: 'text',
              default: '',
              title: 'Funding',
              question: 'Funding details relevant for the AI.',
            },
          },
          {
            id: '6',
            type: 'boolean',
            default: false,
            title: 'Appear in search',
            question: 'Specify whether the AI should appear in the search.',
          },
        ]
      },
      {
        id: 'P', type: 'complex', title: 'Purpose', question: '', subs: [
          {
            id: '1',
            type: 'text',
            default: '',
            title: 'Purpose',
            question: 'What is your AI designed to learn or predict?',
          },
          {
            id: '2',
            type: 'complex',
            title: 'Surrogate marker',
            question: 'Does your AI predict a surrogate marker?',
            subs: [
              {
                id: '1',
                type: 'boolean',
                default: false,
                title: 'Purpose',
                question: 'Does your AI predict a surrogate marker?',
              },
              {
                id: '2',
                type: 'text',
                default: '',
                condition: (val: any) => val['1'] === true,
                title: 'Purpose',
                question: 'More detailed information',
              },
            ]
          },
          {
            id: '3',
            type: 'complex',
            title: 'AI category',
            question: 'To which category does your AI problem belong?',
            subs: [
              {
                id: '1',
                type: 'select',
                default: undefined,
                title: 'Category',
                question: 'To which category does your AI problem belong?',
                config: {
                  allowCustom: false,
                  options: [
                    'Classification',
                    'Continuous estimation',
                    'Clustering',
                    'Dimensionality reduction',
                    'Anomaly detection',
                    'Ranking / Recommendation',
                    'Data generation',
                    'Other'
                  ],
                },
              },
              {
                id: '2',
                type: 'text',
                default: '',
                condition: (val: any) => val['1'] === 'Other',
                title: 'Category',
                question: 'More detailed information',
              },
            ]
          },
        ]
      },
      {
        id: 'D',
        type: 'list',
        title: 'Dataset',
        sub: {
          type: 'complex',
          title: 'Title',
          question: 'Title of the AI',
          subs: [
            {
              id: '1',
              type: 'text',
              default: '',
              title: 'A',
              question: 'More detailed information',
            },
            {
              id: '2',
              type: 'text',
              default: '',
              title: 'B',
              question: 'More detailed information',
            },
          ]
        },
      },
      {
        id: 'M',
        type: 'complex',
        title: 'Method',
        subs: [],
      },
      {
        id: 'R',
        type: 'complex',
        title: 'Reproducibility',
        subs: [],
      },
    ]
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      this.password = params.p;

      // if (this.id) {
      //   this.http.get<IQuestionnaire>(`${environment.url}api/questionnaire?id=${this.id}`).subscribe((resp) => {
      //     this.questionnaire = expandQuestionnaireFields(resp);
      //     this.revising = true;
      //   });
      // }
    });

    this.createDefaults();
  }

  public getSection(s: string): IQuestion {
    for (const q of this.questions.subs) {
      if (q.id === s) {
        return q;
      }
    }
  }

  public createDefaults() {
    this.answers = createDefaults(this.questions);
  }

  // public updateEmail() {
  //   if (this.emailChanged) {
  //     // In this case, the author already has entered something. We don't want to override this.
  //     return;
  //   }
  //   this.email = this.questionnaire.authorEmail;
  // }

  public async goToStep(step: number) {
    this.step = Number(step);

    if (this.step === 6) {
      this.showScores = true;
      // this.missingFields = this.checkFields();
      // if (this.missingFields.length === 0) {
      //   await this.generatePreview();
      // }
    }
  }

  public addDataset() {
    // this.questionnaire.datasets.push(createDataset());
  }

  public removeDataset(i) {
    // this.questionnaire.datasets.splice(i, 1);
  }

  public async submitQuestionnaire() {
    // this.submitted = true;
    // if (this.id && this.password) {
    //   this.http.post<any>(`${environment.url}api/questionnaire?id=${this.id}&p=${this.password}`, {
    //     questionnaire: this.questionnaire,
    //   }).subscribe((r) => {
    //     this.id = r.id;
    //     this.password = r.password;
    //   });
    // } else {
    //   this.http.post<any>(`${environment.url}api/questionnaire`, {
    //     questionnaire: this.questionnaire,
    //     attachReport: this.attachReport,
    //     email: this.email,
    //   }).subscribe((r) => {
    //     this.id = r.id;
    //     this.password = r.password;
    //   });
    // }
  }

  public async generatePreview() {
    // this.displayPDF = false;
    // this.generatingPDF = true;
    // this.http
    //   .post(`${environment.url}api/preview`, JSON.stringify(this.questionnaire), {responseType: 'blob'})
    //   .pipe(map((result: any) => {
    //     return result;
    //   }))
    //   .subscribe((res) => {
    //     this.generatingPDF = false;
    //     this.pdfViewer.pdfSrc = res;
    //     this.pdfViewer.refresh();
    //     this.displayPDF = true;
    //   });
  }

  public checkFields(): any[] {
    return [];
    // const missingFields: MissingField[] = [];
    //
    // return missingFields;
  }

}
