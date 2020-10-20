import {Component, OnInit, ViewChild} from '@angular/core';
import {IQuestion, ISection} from '../../interfaces';
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

  public steps: { step: number, section: ISection }[] = [
    {
      step: 1, section: {
        short: 'MD', title: 'Metadata', icon: 'fa-at', questions: [
          {
            id: '1',
            title: 'Title',
            help: 'TestTestTest',
            question: 'Title of the AI.',
            type: 'string',
            default: ''
          },
          {
            id: '2',
            title: 'Short Title',
            help: '',
            question: 'Short title of the AI.',
            type: 'text',
            default: '',
          },
          {
            id: '3',
            title: 'Keywords',
            help: '',
            question: 'Keywords relevant for the AI.',
            type: 'tags',
            default: [],
            config: {
              allowCustom: true,
              options: ['tag1', 'tag2'],
            },
          },
          {
            id: '4',
            title: 'Contact',
            help: '',
            question: '',
            type: 'list',
            default: [],
            sub:
              {
                id: '1',
                title: 'Contact',
                help: '',
                question: '',
                type: 'complex',
                default: {},
                subs: [
                  {
                    sub: {
                      id: '1',
                      title: 'Name',
                      help: '',
                      question: 'Name of the author.',
                      type: 'string',
                      default: ''
                    }
                  },
                  {
                    sub: {
                      id: '2',
                      title: 'Institution',
                      help: '',
                      question: 'Name of the institution.',
                      type: 'string',
                      default: ''
                    }
                  },
                  {
                    sub: {
                      id: '3',
                      title: 'Email',
                      help: '',
                      question: 'Email address of the author.',
                      type: 'string',
                      default: ''
                    }
                  },
                  {
                    sub: {
                      id: '4',
                      title: 'ORCID iD',
                      help: '',
                      question: 'ORCID iD of the author.',
                      type: 'string',
                      default: '',
                      optional: true
                    }
                  },
                ]
              },
          },
          {
            id: '5',
            title: 'Funding',
            help: '',
            question: 'Funding details relevant for the AI.',
            type: 'list',
            default: [],
            sub: {
              id: '',
              title: 'Funding',
              help: '',
              question: 'Funding details relevant for the AI.',
              type: 'text',
              default: '',
            }
          },
          {
            id: '6',
            title: 'Appear in search',
            help: '',
            question: 'Specify whether the AI should appear in the search.',
            type: 'boolean',
            default: false,
          },
        ]
      }
    },
    {
      step: 2, section: {
        short: 'P', title: 'Purpose', icon: 'fa-bullseye-arrow', questions: [
          {
            id: '1',
            title: 'Purpose',
            help: '',
            question: 'What is your AI designed to learn or predict?',
            type: 'text',
            default: ''
          },
          {
            id: '2',
            title: 'Surrogate marker',
            help: '',
            question: 'Does your AI predict a surrogate marker?',
            type: 'complex',
            default: {},
            subs: [
              {
                sub: {
                  id: '1',
                  title: 'Purpose',
                  help: '',
                  question: 'Does your AI predict a surrogate marker?',
                  type: 'boolean',
                  default: false,
                }
              },
              {
                condition: (val: any) => val['1'] === true,
                sub: {
                  id: '2',
                  title: 'Purpose',
                  help: '',
                  question: 'More detailed information',
                  type: 'text',
                  default: ''
                }
              },
            ]
          },
          {
            id: '3',
            title: 'AI category',
            help: '',
            question: 'To which category does your AI problem belong?',
            type: 'complex',
            default: {},
            subs: [
              {
                sub: {
                  id: '1',
                  title: 'Category',
                  help: '',
                  question: 'To which category does your AI problem belong?',
                  type: 'select',
                  default: undefined,
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
                }
              },
              {
                condition: (val: any) => val['1'] === 'Other',
                sub: {
                  id: '2',
                  title: 'Category',
                  help: '',
                  question: 'More detailed information',
                  type: 'text',
                  default: ''
                }
              },
            ]
          },
        ]
      }
    },
    {
      step: 3, section: {
        short: 'D', title: 'Data', icon: 'fa-database', questions: [
          {
            id: '', title: 'Dataset', help: '', question: '', type: 'list', default: [], sub: {
              id: '', title: 'Title', help: '', question: 'Title of the AI', type: 'complex', default: {}, subs: [
                {
                  sub: {
                    id: '1',
                    title: 'A',
                    help: '',
                    question: 'More detailed information',
                    type: 'text',
                    default: ''
                  }
                },
                {
                  sub: {
                    id: '2',
                    title: 'B',
                    help: '',
                    question: 'More detailed information',
                    type: 'text',
                    default: ''
                  }
                },
              ]
            },
          }
        ]
      }
    },
    {
      step: 4, section: {
        short: 'M', title: 'Method', icon: 'fa-function', questions: []
      }
    },
    {
      step: 5, section: {
        short: 'R', title: 'Reproducibility', icon: 'fa-redo', questions: []
      }
    },
  ];

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
