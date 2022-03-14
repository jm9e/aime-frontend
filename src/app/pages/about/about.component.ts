import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MetaService} from '../../services/meta.service';

type aimeVersion = '2021.0';

interface Member {
	firstName: string;
	lastName: string;
	sortName?: string;
	executive?: boolean;
	institution: string,
	country: string;
	version: aimeVersion
}

@Component({
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

	public showExecutive = true;
	public showSteering = true;

	public executives: Member[] = [];
	public members: Member[] = [];

	constructor(private meta: MetaService, private http: HttpClient) {
		meta.setTitle('About');

		const sortFunc = (a, b) => {
			const aName = a.sortName ?? a.lastName;
			const bName = b.sortName ?? b.lastName;
			if (aName > bName) {
				return 1;
			}
			if (aName < bName) {
				return -1;
			}
			return 0;
		};

		this.http.get<any>(`${environment.api}committee`).subscribe((data) => {
			this.members = data;
			this.members = this.members.sort(sortFunc);
			this.executives = this.members.filter(m => m.executive);
		});
	}

	ngOnInit() {
	}

}
