import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { Users } from 'src/app/models/users';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels: Channel[] = [];

 
  loading: boolean = false;

  constructor(private router: Router, private graphService: GraphService, private channelService: ChannelRegisterServiceService) { 
    
  }

  ngOnInit(): void {
    this.channelService.getAll().subscribe(data => {
      this.channels = data;
    });
  }

  directChannel(id: any, channelID: any) {

    this.loading = true;

    this.router.navigateByUrl('leaderboards', {
      state: {id: id, channelID: channelID}
  }).then(_ => {
    this.loading = false;
  });

    

    
  }

}
