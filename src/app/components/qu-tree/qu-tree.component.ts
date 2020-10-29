import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IQuestion} from '../../interfaces';

@Component({
	selector: 'app-qu-tree',
	templateUrl: './qu-tree.component.html',
	styleUrls: ['./qu-tree.component.scss']
})
export class QuTreeComponent implements OnInit {

	@Input() id: string;
	@Input() question: IQuestion;
	@Input() idPrefix: string;
	@Input() hideNode = false;

	public fullId = '';

	constructor() {
	}

	ngOnInit(): void {
		if (this.idPrefix && this.id) {
			this.fullId = this.idPrefix + '.' + this.id;
		} else {
			this.fullId = this.idPrefix + this.id;
		}
	}

}
