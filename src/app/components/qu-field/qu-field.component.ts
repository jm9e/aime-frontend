import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-qu-field',
  templateUrl: './qu-field.component.html',
  styleUrls: ['./qu-field.component.scss']
})
export class QuFieldComponent implements OnInit {

  @Input() title: string;
  @Input() description: boolean;
  @Input() value: number;
  @Output() valueChange = new EventEmitter();

  public expanded = false;

  constructor() {
  }

  ngOnInit() {
  }

}
