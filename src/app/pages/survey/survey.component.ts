import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';

declare var grecaptcha;

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  public suggestedQuestion = '';
  public questionReason = '';
  public generalFeedback = '';
  public emailAddress = '';
  public contactDetails = '';
  public requestAuthorship = true;

  public message = '';
  public messageType: 'primary' | 'danger' = 'primary';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.message = '';
    this.loadRecaptcha();
  }

  public async submitSurvey() {
    const reqObj = {
      suggestedQuestion: this.suggestedQuestion,
      questionReason: this.questionReason,
      generalFeedback: this.generalFeedback,
      emailAddress: this.emailAddress,
      contactDetails: this.contactDetails,
      requestAuthorship: this.requestAuthorship,
      reToken: grecaptcha.getResponse(),
    };
    this.suggestedQuestion = '';
    this.questionReason = '';
    this.generalFeedback = '';
    this.emailAddress = '';
    this.contactDetails = '';

    this.http.post(`${environment.api}api/survey`, reqObj).toPromise()
      .catch((e: HttpErrorResponse) => {
      this.message = e.error;
      this.messageType = 'danger';
    }).then(() => {
      this.message = 'Thank you for your participation!';
      this.messageType = 'primary';
    });
  }

  public loadRecaptcha() {
    (window as any).onloadCallback = () => {
      grecaptcha.render('g-recaptcha', {
        sitekey: '6LeEEvoUAAAAAE6Z2TvqeVFnNTiqnC2_bPOikyP3',
      });
    };

    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

}
