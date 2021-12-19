import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { Channel } from 'src/app/models/channel';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {

  meetings: Array<MicrosoftGraph.ChatMessage> = [];
  page:number = 1;
  loading: boolean = false;
  channel: Channel = new Channel();
  myCurrentDate: Date;
  myPastDate: Date;
  myCurrentDate1: Date;
  myPastDate1: Date;
  myCurrentDate2: Date;
  myPastDate2: Date;


  constructor(private authService: AuthService, private router: Router, private graphService: GraphService) { 
    this.myCurrentDate = new Date();
    this.myPastDate= new Date(this.myCurrentDate);
    this.myPastDate.setDate(this.myPastDate.getDate() - 7);

    this.myCurrentDate1 = new Date(this.myCurrentDate);
    this.myCurrentDate1.setDate(this.myPastDate.getDate());

    this.myPastDate1 = new Date(this.myCurrentDate);
    this.myPastDate1.setDate(this.myCurrentDate1.getDate() - 7);

    this.myCurrentDate2 = new Date(this.myPastDate1);
    this.myCurrentDate2.setDate(this.myPastDate1.getDate());

    this.myPastDate2 = new Date(this.myCurrentDate2);
    this.myPastDate2.setDate(this.myCurrentDate2.getDate() - 7);

    if(this.router.getCurrentNavigation()?.extras.state){
      this.channel = this.router.getCurrentNavigation()!.extras!.state!.channel;
      this.setData(this.channel,this.myPastDate, true);
    }   
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void {
  }

  setData(channel: Channel, startDate: Date, all: boolean): void {
    this.loading = true;
    this.graphService.getListMeeting(channel, startDate, all).then((data: Array<MicrosoftGraph.ChatMessage>) => {
      this.meetings = data;
    }).then( _ => {
      this.loading = false;
    })
  }

  directLeaderboard(meetingID: any) {
    this.loading = true;

    this.router.navigateByUrl('leaderboards', {
      state: {channel: this.channel, messageID: meetingID}
  }).then(_ => {
    this.loading = false;
  });
  }

  selectEvent(option: string) {
    switch(option) {
      case "1":
        this.setData(this.channel, this.myPastDate, false)
         break;
      case "2":
        this.setData(this.channel, this.myPastDate1, false)
         break;
      case "3":
        this.setData(this.channel, this.myPastDate2, false)
         break;
      case "4":
        this.setData(this.channel, this.myPastDate2, true)
         break;
    }
  }

}
