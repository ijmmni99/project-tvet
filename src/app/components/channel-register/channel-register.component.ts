import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import { AlertsService } from 'src/app/services/alerts.service';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';

@Component({
  selector: 'app-channel-register',
  templateUrl: './channel-register.component.html',
  styleUrls: ['./channel-register.component.css']
})
export class ChannelRegisterComponent implements OnInit {

  options: boolean = false;
  submitted: boolean = false;
  teamid: any;
  students: Array<Users> = [];

  constructor(public service: ChannelRegisterServiceService, private alertService: AlertsService) { }

  ngOnInit(): void {
  }

  OnNext(){
    try{
      if(this.options){
        this.teamid = this.service.register_form.get('teamsID')!.value;
        this.submitted = true;
      }
      else
      {
        //https://teams.microsoft.com/l/channel/19%3adf70ceddab834341b6feae3e8916b76f%40thread.tacv2/Design?groupId=deb44936-3f8a-4d8b-b46d-8bb96da7ec36&tenantId=9f952c8b-5bd3-45e9-96ec-7f8b668f1537
        //https://teams.microsoft.com/l/channel/19%3a249d86d1a330430bab92557cc6061367%40thread.tacv2/Digital%2520Assets%2520Web?groupId=deb44936-3f8a-4d8b-b46d-8bb96da7ec36&tenantId=9f952c8b-5bd3-45e9-96ec-7f8b668f1537
        
          let link = this.service.register_form_link.get('teamsLink')!.value;
          let teamsMetadata = link.split('/');
          let channelid = teamsMetadata[5]
          let teamsandtenant = teamsMetadata[6].split('groupId=').pop();
          let teamsid = teamsandtenant!.substring(0, teamsandtenant!.indexOf('&tenantId='))
    
          this.service.register_form.setValue({
            subjectCode: this.service.register_form_link.get('subjectCode')!.value,
            subjectName: this.service.register_form_link.get('subjectName')!.value,
            teamsID: teamsid,
            channelID: channelid,
            lecturerID: ''
          })

          this.teamid = teamsid;
          this.submitted = true;
          
      }
    }
    catch(error){
      this.alertService.addError('' + error);
    }
  }

  OnSubmit() {
    this.service.registerChannel(this.service.register_form.value, this.students).subscribe(data => {
      if(data.ok) {
        console.log(data)
        this.service.initializeFormGroup();
        this.students = [];
        this.submitted = false;
        this.alertService.addSuccess('Successfully Registered');
      }
      else{
        this.alertService.addError(data.statusText);
      }
    })
  }

  OnUpdate() {
    this.service.updateChannel(this.service.register_form.get('channelID')?.value, this.service.register_form.value);
  }

  AddStudent(member: Users){
    this.students.push(member)
  }

}
