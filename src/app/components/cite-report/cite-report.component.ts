import {Component, Input, OnInit} from '@angular/core';
import {IQuestionnaire} from '../../interfaces';

@Component({
  selector: 'app-cite-report',
  templateUrl: './cite-report.component.html',
  styleUrls: ['./cite-report.component.scss']
})
export class CiteReportComponent implements OnInit {

  @Input() id: string;
  @Input() questionnaire: IQuestionnaire;

  constructor() {
  }

  ngOnInit() {
  }

}
