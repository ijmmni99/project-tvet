import { Component, OnInit } from '@angular/core';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';

@Component({
  selector: 'app-channel-register',
  templateUrl: './channel-register.component.html',
  styleUrls: ['./channel-register.component.css']
})
export class ChannelRegisterComponent implements OnInit {

  constructor(public service: ChannelRegisterServiceService) { }

  ngOnInit(): void {
  }

  OnSubmit(){
    this.service.registerChannel(this.service.register_form.value);
  }

}
