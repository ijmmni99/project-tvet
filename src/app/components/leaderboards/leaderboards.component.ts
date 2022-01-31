import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { User } from 'src/app/models/user';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements OnInit {

  recording: string = '';
  chats: Array<Users> = [];
  page: number = 1;
  channelChoose: boolean = false;
  dataSource: any[] | undefined;
  loading: boolean = false;
  winner: Users = new Users();
  logStudentIndex: number = 0;
  logStudentScore: number = 0;
  logStudentChats: Array<MicrosoftGraph.ChatMessage> = [];
  channel: Channel = new Channel();
  imgReady: boolean = false;

  dummyImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png"

  myCurrentDate: Date;
  myPastDate: Date;
  meeting: MicrosoftGraph.ChatMessage = {};

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get isStudent(): boolean {
    return this.authService.isStudent;
  }

  constructor(private sanitizer: DomSanitizer, private alertsService: AlertsService, private authService: AuthService, private router: Router, private graphService: GraphService) {

    this.myCurrentDate = new Date();
    this.myPastDate = new Date(this.myCurrentDate);
    this.myPastDate.setDate(this.myPastDate.getDate() - 14);

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.channel = this.router.getCurrentNavigation()!.extras!.state!.channel;
      this.meeting = this.router.getCurrentNavigation()!.extras!.state!.meeting;
      
      this.setData(this.channel, this.meeting);
    }
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void {

  }

  setData(channel: Channel, meeting: MicrosoftGraph.ChatMessage): void {
    this.loading = true;
    this.graphService.getListMessage(channel, meeting.id).then((data: Array<Users>) => {
      this.chats = data;

      if (this.authService.isStudent) {
        this.logStudentIndex = this.chats.findIndex(element => element.studentId = this.authService.authUser.localAccountId);
        this.logStudentScore = this.chats.find(element => element.studentId = this.authService.authUser.localAccountId)!.messageCount.length;
        this.logStudentChats = this.chats.find(element => element.studentId = this.authService.authUser.localAccountId)!.messageCount;
      }

      if (this.chats.length > 0)
        this.winner = data[0];
    }).then(_ => {
      this.recording = this.graphService.recording;
      this.loading = false;
    })
  }

  directNotes() {

    if(this.logStudentChats.length < 1) {
      this.loading = false;
      return this.alertsService.addError("There's no data found");
    }

    this.loading = true;

    this.router.navigateByUrl('notes', {
      state: { chats: this.logStudentChats }
    }).then(_ => {
      this.loading = false;
    });
  }

  directQuestions() {

    this.loading = true;
    let questions: MicrosoftGraph.ChatMessage[] = [];
    let chats_question = this.chats.filter(element => element.messageCount.length > 0)
    
    chats_question.forEach(element => {
      questions = [...questions, ...element.messageCount]
    });

    questions = questions.filter(chat => chat.body?.content?.includes('?'))

    if(questions.length < 1) {
      this.loading = false;
      return this.alertsService.addError("There's no questions found");
    }
      

    this.router.navigateByUrl('notes', {
      state: { chats: questions}
    }).then(_ => {
      this.loading = false;
    });
  }

  navigateRecording() {
    window.location.href=this.recording;
  }

  getSantizeUrl(imgBlob: Blob) {
    if (!imgBlob) {
      return null;
    }

    const url = window.URL || window.webkitURL;
    let imgurl = url.createObjectURL(imgBlob)
    return this.sanitizer.bypassSecurityTrustUrl(imgurl);
  }

  onImgError(event: any) {
    event.target.src = this.dummyImg;
  }

  

}
