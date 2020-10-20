import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cite-report',
  templateUrl: './cite-report.component.html',
  styleUrls: ['./cite-report.component.scss']
})
export class CiteReportComponent implements OnInit {

  @Input() id: string;

  constructor() {
  }

  ngOnInit() {
  }

}
