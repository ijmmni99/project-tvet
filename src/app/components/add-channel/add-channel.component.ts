import { Component, OnInit } from '@angular/core';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {

  constructor(public service: ChannelRegisterServiceService) { }

  ngOnInit(): void {
  }

  OnSearch(){
    this.service.findChannel(this.service.search_form.get('subjectCode')?.value);
  }

  

}
