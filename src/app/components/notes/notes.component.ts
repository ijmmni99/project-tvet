import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  loading: boolean = false;
  chats: Array<MicrosoftGraph.ChatMessage> = [];

  constructor(private authService: AuthService, private router: Router, private graphService: GraphService) { 
    if(this.router.getCurrentNavigation()?.extras.state){
      this.chats = this.router.getCurrentNavigation()!.extras!.state!.chats;
      console.log(this.chats)
    }   
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void { }

}
