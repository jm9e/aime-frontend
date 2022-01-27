import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

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

	public executives: Member[] = [
		{
			firstName: 'Julian',
			lastName: 'Matschinske',
			institution: 'University of Hamburg',
			country: 'Germany',
			version: '2021.0'
		},
		{
			firstName: 'David B.',
			lastName: 'Blumenthal',
			institution: 'FAU Erlangen-Nuremberg',
			country: 'Germany',
			version: '2021.0'
		},
		{
			firstName: 'Jan',
			lastName: 'Baumbach',
			institution: 'University of Hamburg; University of Southern Denmark',
			country: 'Germany; Denmark',
			version: '2021.0'
		},
	];

	public members: Member[] = [];

	constructor(private http: HttpClient) {
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
