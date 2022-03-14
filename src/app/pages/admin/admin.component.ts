import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MetaService} from "../../services/meta.service";

type aimeVersion = '2021.0';

interface Message {
	id: string;
	senderId: string;
	senderEmail: string;
	createdAt: Date;
	subject: string;
	message: string;
}

interface Member {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	sortName?: string;
	executive?: boolean;
	institution: string,
	country: string;
	version: aimeVersion
}

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

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

	public loginEmail = '';
	public loginPassword = '';
	public token?: any;
	public loading = false;
	public notificationType = '';
	public notification = '';

	public subject = '';
	public message = 'Hello %FIRST_NAME% %LAST_NAME%,\n\n...\n\nBest regards,\n...';
	public messages?: Message[];

	public members?: Member[];
	public memberSelected?: Member;
	public memberAction?: 'edit' | 'delete' | 'add';

	constructor(private meta: MetaService, private http: HttpClient) {
		meta.setTitle('Admin area');
		const tokenStr = localStorage.getItem('token');
		if (tokenStr) {
			this.token = JSON.parse(tokenStr);
			this.refresh().then();
		}
	}

	private async refresh(): Promise<void> {
		this.members = await this.http.get<Member[]>(`${environment.api}admin/committee`, {
			headers: {
				Authentication: JSON.stringify(this.token),
			}
		}).toPromise();
		this.members = this.members.sort(sortFunc);

		this.messages = await this.http.get<Message[]>(`${environment.api}admin/message`, {
			headers: {
				Authentication: JSON.stringify(this.token),
			}
		}).toPromise();
		this.messages = this.messages.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
	}

	ngOnInit(): void {
	}

	public async login(): Promise<void> {
		this.http.post<any>(`${environment.api}admin/auth`, {
			email: this.loginEmail,
			password: this.loginPassword,
		}).subscribe(async (data) => {
			this.token = data;
			localStorage.setItem('token', JSON.stringify(this.token));
			await this.refresh();
		}, (error => {
			this.notificationType = 'danger';
			if (typeof error.error === 'string') {
				this.notification = error.error;
			} else {
				this.notification = error.message;
			}
		}));
	}

	public async logout(): Promise<void> {
		this.token = undefined;
		localStorage.removeItem('token');
	}

	public resetLoading(clearNotification = true, clearMessage = true) {
		this.loading = false;
		this.memberSelected = undefined;
		this.memberAction = undefined;
		if (clearNotification) {
			this.notificationType = undefined;
			this.notification = undefined;
		}
		if (clearMessage) {
			this.message = '';
		}
	}

	public handleError(error: any) {
		this.resetLoading(false, false);
		this.notificationType = 'danger';
		if (typeof error.error === 'string') {
			this.notification = error.error;
		} else {
			this.notification = error.message;
		}
	}

	public async sendMessage(): Promise<void> {
		this.loading = true;
		this.http.post<any>(`${environment.api}admin/message`, {
			subject: this.subject,
			message: this.message,
		}, {
			headers: {
				Authentication: JSON.stringify(this.token),
			},
			responseType: 'text' as any,
		}).subscribe(async () => {
			this.resetLoading();
			await this.refresh();
		}, (err) => this.handleError(err));
	}

	public async addMember(): Promise<void> {
		this.memberSelected = {
			id: '',
			email: '',
			lastName: '',
			firstName: '',
			sortName: '',
			institution: '',
			country: '',
			version: '2021.0',
			executive: false,
		}
		this.memberAction = 'add';
	}

	public async editMember(m: Member, confirmed = false): Promise<void> {
		if (!confirmed) {
			this.memberSelected = m;
			this.memberAction = 'edit';
		} else {
			this.loading = true;
			this.http.post<any>(`${environment.api}admin/committee?email=${encodeURIComponent(m.email)}&name=${encodeURIComponent(m.lastName + ', ' + m.firstName)}`,
				this.memberSelected, {
					headers: {
						Authentication: JSON.stringify(this.token),
					},
					responseType: 'text' as any,
				}).subscribe(async () => {
				this.resetLoading();
				await this.refresh();
			}, (err) => this.handleError(err));
		}
	}

	public async deleteMember(m: Member, confirmed = false): Promise<void> {
		if (!confirmed) {
			this.memberSelected = m;
			this.memberAction = 'delete';
		} else {
			this.loading = true;
			this.http.delete<any>(`${environment.api}admin/committee?id=${encodeURIComponent(m.id)}`, {
				headers: {
					Authentication: JSON.stringify(this.token),
				},
				responseType: 'text' as any,
			}).subscribe(async () => {
				this.resetLoading();
				await this.refresh();
			}, (err) => this.handleError(err));
		}
	}

}
