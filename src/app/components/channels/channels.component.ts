import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels = [
    { code: "BITP 2314", title: "HCI", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Maslina', teamid: 'deb44936-3f8a-4d8b-b46d-8bb96da7ec36'},
    { code: "BITP 2444", title: "DB", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Rohazah', teamid: 'deb44936-3f8a-4d8b-b46d-8bb96da7ec36'},
    { code: "BITP 3456", title: "Multimedia", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Kamsah', teamid: 'deb44936-3f8a-4d8b-b46d-8bb96da7ec36'},
    { code: "BITP 3122", title: "Programming", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Azlina', teamid: 'deb44936-3f8a-4d8b-b46d-8bb96da7ec36'},
    { code: "BITP 3122", title: "Programming", img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png', lecturer: 'Pn. Azlina', teamid: 'deb44936-3f8a-4d8b-b46d-8bb96da7ec36'},
  ]

 
  loading: boolean = false;

  constructor(private router: Router, private graphService: GraphService) { 
    
  }

  ngOnInit(): void {
  }

  directChannel(id: any) {

    this.loading = true;

    this.router.navigateByUrl('leaderboards', {
      state: {id: id}
  }).then(_ => {
    this.loading = false;
  });

    

    
  }

}
