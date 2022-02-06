import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { Note } from 'src/app/models/note';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { GraphService } from 'src/app/services/graph.service';
import { NoteService } from 'src/app/services/note.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  loading: boolean = false;
  messageSelected : boolean = false;
  update: boolean = false;
  print: boolean = false;
  chats: Array<MicrosoftGraph.ChatMessage> = [];
  page: number = 1;
  note_index: number = 0;
  meeting: MicrosoftGraph.ChatMessage | undefined;
  mergeMessage: any;

  @ViewChild('notes', { read: ElementRef, static:false }) notes!: ElementRef;
  
  get isStudent(): boolean {
    return this.authService.isStudent;
  }

  constructor(private alertService: AlertsService,private authService: AuthService, private router: Router, public noteService: NoteService) { 
    if(this.router.getCurrentNavigation()?.extras.state){
      this.meeting = this.router.getCurrentNavigation()!.extras!.state!.meeting;
      this.chats = this.router.getCurrentNavigation()!.extras!.state!.chats;
      this.chats = this.chats.sort((b, a) => new Date(b.createdDateTime!).getTime() - new Date(a.createdDateTime!).getTime());
      
      let note: Note = new Note();

      note.meetingid = this.meeting?.id!;
      this.getLatestNote(note);
      
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

  initializeMessage(message: any, index: number) {
    
    if(message.note){
      this.update = true;
      this.noteService.note_form.setValue({
        messageid: message.id,
        meetingid: this.meeting?.id,
        note: message.note
      })
    }
    else {
      this.update = false;
      this.noteService.note_form.setValue({
        messageid: message.id,
        meetingid: this.meeting?.id,
        note: ''
      })
    }
    
    this.note_index = index;
    this.messageSelected = true;
    console.log(this.noteService.note_form.value)
  }

  OnSubmit() {
    
    if(this.noteService.note_form.invalid)
      return this.alertService.addError('Form is invalid');

    if(this.update){
      this.noteService.updateNote(this.noteService.note_form.value).subscribe(data => {
        if(data.ok){
          console.log(data.body)
          this.alertService.addSuccess('Note has been updated');
          this.getLatestNote(this.noteService.note_form.value);
          this.noteService.initializeFormGroup();
          this.messageSelected = false;
        }
        else
          this.alertService.addError('There is error');
      })
    }
    else{
      this.noteService.addNote(this.noteService.note_form.value).subscribe(data => {
        if(data.ok){
          this.alertService.addSuccess('Note has been added');
          this.getLatestNote(this.noteService.note_form.value);
          this.noteService.initializeFormGroup();
          this.messageSelected = false;
        }
        else
          this.alertService.addError('There is error');
      })
    }
    
  }

  OnCancel() {
    this.noteService.initializeFormGroup();
    this.messageSelected = false;
  }

  getLatestNote(note: Note) {
    this.loading = true;

    this.noteService.getNote(note).subscribe(data => {
      if(data.ok){
        this.mergeMessage = this.chats.map(subject => {
        let otherSubject = data.body!.find(element => element.messageid === subject.id)
          return { ...subject, ...otherSubject }
      })
      this.loading = false;
      }
    });
  }

  openPDF() {
    this.print = true;
    setTimeout(() => {
      this.setPrint().then(_ => {
        this.print = false;
    })
    }, 1000);
  }

  async setPrint() {
    this.notes.nativeElement.classList.remove('sheet');
      this.notes.nativeElement.classList.add('all-white');
  
      const element = document.getElementById('notes')!;

      const doc = new jsPDF('p', 'pt', 'a4');

      const div = element;
      await doc.html(div, {
        x: 40,
        y: 20,
        autoPaging: true,

        callback: function (pdf) {

        pdf.output('dataurlnewwindow');
        },
      }); 
      
      this.notes.nativeElement.classList.remove('all-white');
      this.notes.nativeElement.classList.add('sheet');
  }
}
