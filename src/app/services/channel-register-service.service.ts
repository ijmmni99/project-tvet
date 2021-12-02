import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Channel } from '../models/channel';
import { AuthService } from './auth.service';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Lecturer } from '../models/lecturer';
import { environment } from '../../environments/environment';

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

  search_form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
  })

  lecturer: Lecturer = new Lecturer();

  initializeFormGroup(){
    this.register_form.setValue({
      subjectCode: '',
      subjectName: '',
      teamsID: '',
      channelID: '',
      lecturerID: ''
    })
  }

  getAll() {
    return this.httpClient.get<Channel[]>(`${this.API_SERVER}/channel/`)
  }

  findChannel(id: string) {
    return this.httpClient.get<Channel[]>(`${this.API_SERVER}/channel/${id}`)
  }

  addChannel(channel: Channel) {
    return this.httpClient.post<Channel[]>(`${this.API_SERVER}/channel/add/`, channel);
  }

  registerChannel(channel: Channel): Subscription {

    this.lecturer.teacherId = this.authService.user?.id;
    channel.lecturerID = this.lecturer;

    return this.httpClient.post<Channel>(`${this.API_SERVER}/channel/create/`, channel, {observe: 'response'}).
    subscribe(data => {
      console.log(data)
      if(data.ok)
        this.initializeFormGroup();
      else
        throw new Error(data.statusText)
    })
  }

  updateChannel(id: string,channel: Channel) {
    return this.httpClient.put<Channel>(`${this.API_SERVER}/channel/${id}/update`, channel);
  }

  deleteChannel(id: string) {
    return this.httpClient.delete(`${this.API_SERVER}/channel/${id}/delete`);
  }

}
