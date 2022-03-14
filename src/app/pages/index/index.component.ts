import {Component, OnInit} from '@angular/core';
import {MetaService} from "../../services/meta.service";

@Component({
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	constructor(private meta: MetaService) {
		meta.setTitle();
	}

	ngOnInit() {
	}

}
