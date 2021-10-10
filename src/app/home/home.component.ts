import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  page:number = 1;
  channelChoose: boolean = false; loading: boolean = false;
  winner = { name: '', img: ''};
  dataSource: any[] | undefined;
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

    channels = [
      { code: "BITP 2314", title: "HCI", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Maslina'},
      { code: "BITP 2444", title: "DB", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Rohazah'},
      { code: "BITP 3456", title: "Multimedia", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Kamsah'},
      { code: "BITP 3122", title: "Programming", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Azlina'},
      { code: "BITP 3122", title: "Programming", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Azlina'},
    ]

    class = "BITP 2314"
  
  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user
  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { 
    
  }

  ngOnInit() {
    let sortedTeam = this.students.sort((a, b) => b.sent - a.sent);
    this.winner = {name: sortedTeam[0].name, img: sortedTeam[0].img};
    this.students.sort((a, b) => b.kudos - a.kudos);
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();
  }

  randomEmoji = () => {
    const emojis = ['👏', '👍', '🙌', '🤩', '🔥', '⭐️', '🏆', '💯'];
    let randomNumber = Math.floor(Math.random() * emojis.length);
    return emojis[randomNumber];
  };

  signOut(): void {
    this.authService.signOut();
  }

  directChannel() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.channelChoose = true;
    }, 1000);
  }
}