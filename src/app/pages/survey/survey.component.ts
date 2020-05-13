import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  public suggestedQuestion = '';
  public questionReason = '';
  public generalFeedback = '';
  public contactDetails = '';
  public requestAuthorship = true;

  public message = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.message = '';
  }

  public async submitSurvey() {
    const reqObj = {
      suggestedQuestion: this.suggestedQuestion,
      questionReason: this.questionReason,
      generalFeedback: this.generalFeedback,
      contactDetails: this.contactDetails,
      requestAuthorship: this.requestAuthorship,
    };
    this.suggestedQuestion = '';
    this.questionReason = '';
    this.generalFeedback = '';
    this.contactDetails = '';
    await this.http.post(`/api/survey`, reqObj).toPromise();

    this.message = 'Thank you for your contribution!';
  }

}
