import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels: Channel[] | null = [];

 
  loading: boolean = false;
  
  constructor(private router: Router, private authService: AuthService, private channelService: ChannelRegisterServiceService) { 
    
  }

  ngOnInit(): void {
    this.loading = true;
    if(this.authService.isStudent){
      this.channelService.getAll().subscribe(data => {
        this.channels = data;
        this.loading = false;
      });
    }
    else{
      this.channelService.getAllbyID().subscribe(data => {
        this.channels = data.body;
        this.loading = false;
      });
    }   
  }

  directChannel(id: any, channelID: any, subjectCode: any) {

    this.loading = true;

    this.router.navigateByUrl('meetings', {
      state: {id: id, channelID: channelID, class: subjectCode}
  }).then(_ => {
    this.loading = false;
  });

    

    
  }

}
