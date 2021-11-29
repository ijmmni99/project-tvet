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

  register_form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
    subjectName: new FormControl('', Validators.required),
    teamsID: new FormControl('', Validators.required),
    channelID: new FormControl('', Validators.required),
  });

  search_form: FormGroup = new FormGroup({
    subjectCode: new FormControl('', Validators.required),
  })

  initializeFormGroup(){
    this.register_form.setValue({
      subjectCode: '',
      subjectName: '',
      teamsID: '',
      channelID: '',
    })
  }

  findChannel(id: string) {
    return this.httpClient.get<Channel[]>(`${this.API_SERVER}/channels/${id}`)
  }

  addChannel(channel: Channel) {
    return this.httpClient.post<Channel[]>(`${this.API_SERVER}/channels/add/`, channel);
  }

  registerChannel(channel: Channel) {
    return this.httpClient.post<Channel>(`${this.API_SERVER}/channel/create`, channel);
  }

  updateChannel(id: string,channel: Channel) {
    return this.httpClient.put<Channel>(`${this.API_SERVER}/channel/${id}/update`, channel);
  }

  deleteChannel(id: string) {
    return this.httpClient.delete(`${this.API_SERVER}/channel/${id}/delete`);
  }

}
