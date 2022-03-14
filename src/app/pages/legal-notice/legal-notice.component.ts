import {Component, OnInit} from '@angular/core';
import {MetaService} from "../../services/meta.service";

@Component({
	selector: 'app-legal-notice',
	templateUrl: './legal-notice.component.html',
	styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit {

	constructor(private meta: MetaService) {
		meta.setTitle('Legal notice');
	}

	ngOnInit(): void {
	}

}
