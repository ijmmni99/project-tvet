import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {

  meetings: Array<MicrosoftGraph.ChatMessage> = [];
  class = "";
  page:number = 1;
  loading: boolean = false;
  teamsid: string = '';
  channelID: string = '';
  myCurrentDate: Date;
  myPastDate: Date;

  constructor(private authService: AuthService, private router: Router, private graphService: GraphService) { 
    this.myCurrentDate = new Date();
    this.myPastDate= new Date(this.myCurrentDate);
    this.myPastDate.setDate(this.myPastDate.getDate() - 14);

    if(this.router.getCurrentNavigation()?.extras.state){
      this.class = this.router.getCurrentNavigation()!.extras!.state!.class;
      this.teamsid = this.router.getCurrentNavigation()!.extras!.state!.id;
      this.channelID = this.router.getCurrentNavigation()!.extras!.state!.channelID;
      this.setData(this.router.getCurrentNavigation()!.extras!.state!.id, this.router.getCurrentNavigation()!.extras!.state!.channelID);
    }   
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void {
  }

  setData(id: string, channelID: string): void {
    this.loading = true;
    this.graphService.getListMeeting(id,channelID).then((data: Array<MicrosoftGraph.ChatMessage>) => {
      this.meetings = data;
    }).then( _ => {
      this.loading = false;
    })
  }

  directLeaderboard(meetingID: any) {
    this.loading = true;

    this.router.navigateByUrl('leaderboards', {
      state: {id: this.teamsid, channelID: this.channelID, class: this.class, messageID: meetingID}
  }).then(_ => {
    this.loading = false;
  });
  }

}
