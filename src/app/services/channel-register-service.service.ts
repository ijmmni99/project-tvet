import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Channel } from '../models/channel';
import { AuthService } from './auth.service';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Lecturer } from '../models/lecturer';
import { environment } from '../../environments/environment';
import { Users } from '../models/users';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class ChannelRegisterServiceService {

  API_SERVER = environment.API_SERVER;

  constructor(private httpClient: HttpClient, public authService: AuthService) { }

  register_form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),
    teamsID: new FormControl('', Validators.required),
    channelID: new FormControl('', Validators.required),
    lecturerID: new FormControl(''),
  });

  register_form_link: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),
    teamsLink: new FormControl('', Validators.required),
    lecturerID: new FormControl(''),
  });

  search_form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
  })

  lecturer: Lecturer = new Lecturer();
  student: Student = new Student();

  initializeFormGroup(){
    this.register_form.setValue({
      subjectCode: '',
      subjectName: '',
      teamsID: '',
      channelID: '',
      lecturerID: ''
    })

    this.register_form_link.setValue({
      subjectCode: '',
      subjectName: '',
      teamsLink: '',
      lecturerID: ''
    })
  }

  getAllMember() {
    return this.httpClient.get<Channel[]>(`${this.API_SERVER}/channel/`)
  }

  getAll() {
    return this.httpClient.get<Channel[]>(`${this.API_SERVER}/channel/`)
  }

  getAllbyID(role: boolean) {

    if(role) {
      this.student.studentId = this.authService.authUser.localAccountId;
      return this.httpClient.post<Channel[]>( `${this.API_SERVER}/channel/student/`, this.student, {observe: 'response'});
    }
    else {
      this.lecturer.teacherId = this.authService.authUser.localAccountId;
      return this.httpClient.post<Channel[]>( `${this.API_SERVER}/channel/lecturer/`, this.lecturer, {observe: 'response'});
    }
    
  }

  findChannel(id: string) {
    return this.httpClient.get<Channel>(`${this.API_SERVER}/channel/${encodeURIComponent(id)}`)
  }

  addChannel(channel: Channel) {
    return this.httpClient.post<Channel[]>(`${this.API_SERVER}/channel/add/`, channel);
  }

  registerChannel(channel: Channel, members: Users[]) {

    this.lecturer.teacherId = this.authService.authUser.localAccountId;
    channel.lecturerID = this.lecturer;
    channel.students = members;

    return this.httpClient.post<Channel>(`${this.API_SERVER}/channel/create/`, channel, {observe: 'response'})
  }

  registerMember(members: Users[], teamid: any) {
    return this.httpClient.post(`${this.API_SERVER}/channel/create/`, members, {observe: 'response'})
  }

  updateChannel(id: string,channel: Channel) {
    return this.httpClient.put<Channel>(`${this.API_SERVER}/channel/${id}/update`, channel);
  }

  deleteChannel(id: string) {
    return this.httpClient.delete(`${this.API_SERVER}/channel/${id}/delete`);
  }

}
