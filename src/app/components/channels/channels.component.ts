import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels: Channel[] | null = [];
  dummyImg = "/assets/no-img.png"
  loading: boolean = false;
  
  constructor(private router: Router, private sanitizer: DomSanitizer, private authService: AuthService, private channelService: ChannelRegisterServiceService, private graphService: GraphService) { 
    
  }

  ngOnInit(): void {
    this.loading = true;
    if(this.authService.isStudent){
      this.channelService.getAllbyID(true).toPromise().then(data => {
        console.log(data)
        this.channels = data.body;
        this.channels?.forEach(element => {
          this.getSantizeUrl(element.teamsID).then(meta => {
            element.imgUrl = meta
          })
        })

        console.log(this.channels)
        this.loading = false;
      });
    }
    else{
      this.channelService.getAllbyID(false).toPromise().then(data => {
        console.log(data)
        this.channels = data.body;
        this.channels?.forEach(element => {
          this.getSantizeUrl(element.teamsID).then(meta => {
            element.imgUrl = meta
          })
        })

        console.log(this.channels)
        this.loading = false;
      });
    }   
  }


  directChannel(channel: Channel) {

    this.loading = true;

    this.router.navigateByUrl('meetings', {
      state: {channel: channel}
  }).then(_ => {
    this.loading = false;
  });
    
  }

  async getSantizeUrl(teamsID: string) {
    let imgBlob = await this.graphService.getTeamPhoto(teamsID);

    if(!imgBlob) {
      return null;
    }
    const url = window.URL || window.webkitURL;
    let imgurl = url.createObjectURL(imgBlob)
    return this.sanitizer.bypassSecurityTrustUrl(imgurl);
  }

  // directChannel(id: any, channelID: any, subjectCode: any, subjectClass: any) {

  //   this.loading = true;

  //   this.router.navigateByUrl('meetings', {
  //     state: {id: id, channelID: channelID, code: subjectCode, class: subjectClass}
  // }).then(_ => {
  //   this.loading = false;
  // });

    

    
  // }

}
