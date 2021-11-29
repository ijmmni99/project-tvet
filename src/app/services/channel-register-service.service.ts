import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../models/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelRegisterServiceService {

  API_SERVER = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),
    teamsID: new FormControl('', Validators.required),
    channelID: new FormControl('', Validators.required),
  });

  initializeFormGroup(){
    this.form.setValue({
      subjectCode: '',
      subjectName: '',
      teamsID: '',
      channelID: '',
    })
  }

  registerChannel(channel: Channel) {
    return this.httpClient.post<Channel>(`${this.API_SERVER}/channel/create`, channel);
  }

  updateChannel(channel: Channel) {
    return this.httpClient.put<Channel>(`${this.API_SERVER}/channel/update`, channel);
  }

  deleteChannel(id: string) {
    return this.httpClient.delete(`${this.API_SERVER}/channel/${id}/delete`);
  }

}
