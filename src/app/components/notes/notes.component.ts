import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  page: number = 1;

  @ViewChild('notes', { read: ElementRef, static:false }) notes!: ElementRef;
  
  get isStudent(): boolean {
    return this.authService.isStudent;
  }

  constructor(private authService: AuthService, private router: Router, private graphService: GraphService) { 
    if(this.router.getCurrentNavigation()?.extras.state){
      this.chats = this.router.getCurrentNavigation()!.extras!.state!.chats;
      this.chats = this.chats.sort((b, a) => new Date(b.createdDateTime!).getTime() - new Date(a.createdDateTime!).getTime());
      setTimeout(() => {
        this.notes.nativeElement.classList.remove('animate-text')
      }, 500);
    }   
    else
      this.router.navigate(['']);
  }

  ngOnInit(): void { }

  nextPage(event: any) {
    this.notes.nativeElement.classList.add('animate-text')
    
    setTimeout(() => {
      this.notes.nativeElement.classList.remove('animate-text')
      this.page = event;
    }, 500);

  }

  toggleBackground() {
    if(this.notes.nativeElement.classList.contains('sheet')){
      this.notes.nativeElement.classList.remove('sheet');
      this.notes.nativeElement.classList.add('all-white');
    }
    else {
      this.notes.nativeElement.classList.add('sheet');
      this.notes.nativeElement.classList.remove('all-white');
    }
  }

}
