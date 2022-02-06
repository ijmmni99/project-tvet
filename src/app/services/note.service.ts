import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Note } from '../models/note';
import { Student } from '../models/student';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  API_SERVER = environment.API_SERVER;

  constructor(private httpClient: HttpClient, public authService: AuthService) { }

  note_form: FormGroup = new FormGroup({
    messageid: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),
    meetingid: new FormControl('', Validators.required),
  });

  initializeFormGroup(){
    this.note_form.setValue({
      messageid: '',
      note: '',
      meetingid: ''
    })
  }

  getNote(note: Note) {
    let student: Student = new Student();
    student.studentId = this.authService.authUser.localAccountId;
    student.name = this.authService.authUser.username;

    note.student = student;

    return this.httpClient.post<Note[]>( `${this.API_SERVER}/note/all/`, note, {observe: 'response'});
  }

  addNote(note: Note) {
    let student: Student = new Student();

    student.name = this.authService.authUser.username;
    student.studentId = this.authService.authUser.localAccountId;

    note.student = student;

    return this.httpClient.post<Note>(`${this.API_SERVER}/note/`, note, {observe: 'response'});
  }

  updateNote(note: Note) {
    return this.httpClient.patch<Note>(`${this.API_SERVER}/note/${encodeURIComponent(note.messageid)}`, note, {observe: 'response'})
  }

  deleteNote(id: string) {
    return this.httpClient.delete(`${this.API_SERVER}/note/${encodeURIComponent(id)}`, {observe: 'response'});
  }

}
