import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { User } from 'src/app/models/user';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';


@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements OnInit {

  students = [
    {
      rank: 1,
      name: 'Lewis Hamilton',
      handle: 'Explorer',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col-retina/image.png',
      kudos: 36,
      sent: 31 },
    {
      rank: 2,
      name: 'Kimi Raikkonen',
      handle: 'Socialiser',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/K/KIMRAI01_Kimi_R%C3%A4ikk%C3%B6nen/kimrai01.png.transform/2col-retina/image.png',
      kudos: 31,
      sent: 21 },
    {
      rank: 3,
      name: 'Sebastian Vettel',
      handle: 'Achiever',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/S/SEBVET01_Sebastian_Vettel/sebvet01.png.transform/2col-retina/image.png',
      kudos: 24,
      sent: 7 },
    {
      rank: 4,
      name: 'Max Verstappen',
      handle: 'Philanthropists',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col-retina/image.png',
      kudos: 22,
      sent: 4 },
    {
      rank: 5,
      name: 'Lando Norris',
      handle: 'Learner',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col-retina/image.png',
      kudos: 18,
      sent: 16 },
    {
      rank: 6,
      name: 'Charles Leclerc',
      handle: 'Newbie',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col-retina/image.png',
      kudos: 16,
      sent: 6 },
    {
      rank: 7,
      name: 'George Russell',
      handle: 'Newbie',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col-retina/image.png',
      kudos: 10,
      sent: 21 },
    {
      rank: 8,
      name: 'Daniel Ricciardo',
      handle: 'Newbie',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/2col-retina/image.png',
      kudos: 7,
      sent: 46 },
    {
      rank: 9,
      name: 'Alexander Albon',
      handle: 'Newbie',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col-retina/image.png',
      kudos: 4,
      sent: 2 },
    {
      rank: 10,
      name: 'Carlos Sainz Jr.',
      handle: 'Newbie',
      img: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col-retina/image.png',
      kudos: 1,
      sent: 24 }];

    challenges = [
      {id: 1, challenge: "At least 20 Chat Reply"},
      {id: 2, challenge: "Ask 3 Questions"},
      {id: 3, challenge: "Answer 2 Questions"}
    ];


  chats: Array<Users> = [];
  page:number = 1;
  channelChoose: boolean = false;
  dataSource: any[] | undefined;
  loading: boolean = false;
  winner: Users = new Users();
  logStudentIndex: number = 0;
  logStudentScore: number = 0;
  logStudentChats: Array<MicrosoftGraph.ChatMessage> = [];
  channel: Channel = new Channel();

  myCurrentDate: Date;
  myPastDate: Date;

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get isStudent(): boolean {
    return this.authService.isStudent;
  }

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private router: Router, private graphService: GraphService) {
    
    this.myCurrentDate = new Date();
    this.myPastDate= new Date(this.myCurrentDate);
    this.myPastDate.setDate(this.myPastDate.getDate() - 14);

    if(this.router.getCurrentNavigation()?.extras.state){
      this.channel = this.router.getCurrentNavigation()!.extras!.state!.channel;
      console.log(this.channel)
      this.setData(this.channel, this.router.getCurrentNavigation()!.extras!.state!.messageID);
    }   
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void {

  }

  setData(channel: Channel, meetingID: string): void {
    this.loading = true;
    this.graphService.getListMessage(channel, meetingID).then((data: Array<Users>) => {
      this.chats = data;

      if(this.authService.isStudent){
        this.logStudentIndex = this.chats.findIndex(element => element.studentId = this.authService.authUser.localAccountId);
        this.logStudentScore = this.chats.find(element => element.studentId = this.authService.authUser.localAccountId)!.messageCount.length;
        this.logStudentChats = this.chats.find(element => element.studentId = this.authService.authUser.localAccountId)!.messageCount;
      }
      
      if(this.chats.length > 0)
        this.winner = data[0];
    }).then( _ => {
      this.loading = false;
    })
  }

  directNotes() {
    this.loading = true;

    this.router.navigateByUrl('notes', {
      state: {chats: this.logStudentChats}
  }).then(_ => {
    this.loading = false;
  });
  }

  getSantizeUrl(imgBlob : Blob) {

    if(!imgBlob) {
      return null;
    }

    const url = window.URL || window.webkitURL;
    let imgurl = url.createObjectURL(imgBlob)
    return this.sanitizer.bypassSecurityTrustUrl(imgurl);
}

}
