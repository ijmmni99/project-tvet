import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Channel } from 'src/app/models/channel';
import { Users } from 'src/app/models/users';
import { AlertsService } from 'src/app/services/alerts.service';
import { ChannelRegisterServiceService } from 'src/app/services/channel-register-service.service';
import { GraphService } from 'src/app/services/graph.service';
import { AddStudentComponent } from '../add-student/add-student.component';

@Component({
  selector: 'app-update-channel',
  templateUrl: './update-channel.component.html',
  styleUrls: ['./update-channel.component.css']
})
export class UpdateChannelComponent implements OnInit {

  options: boolean = false;
  loading: boolean = true;
  teamid: any;
  students_registered: Array<Users> = [];
  channel: Channel = new Channel();
  page_update_student:number = 1;

  @ViewChild(AddStudentComponent) add_student_child!: AddStudentComponent;
  
  constructor(public service: ChannelRegisterServiceService, private alertService:AlertsService, private graphService: GraphService, private router: Router,private sanitizer: DomSanitizer) {
    if(this.router.getCurrentNavigation()?.extras.state){
      this.teamid = this.router.getCurrentNavigation()!.extras!.state!.channel!.teamsID;
      this.channel = this.router.getCurrentNavigation()!.extras!.state!.channel;
    }   
    else
      this.router.navigate(['']);
    
  }

  ngOnInit(): void {
    this.service.register_form.setValue({
      subjectCode: this.channel.subjectCode,
      subjectName: this.channel.subjectName,
      teamsID: this.teamid,
      channelID: this.channel.channelID,
      lecturerID: ''
    })

    this.students_registered = this.channel.students!;

    this.graphService.getPhoto(this.students_registered).then(_ => {
      this.students_registered = _;
      this.students_registered = this.students_registered.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
    })
  }

  AddStudent(member: Users){
    this.students_registered.push(member);
    this.students_registered = this.students_registered.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
  }

  AddStudentAll(member: Users[]) {

    if(this.students_registered.length == 0)
     this.students_registered = member;
    else
      this.students_registered = [...this.students_registered, ...member];
      
    this.students_registered = this.students_registered.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
  }

  RemoveStudent(member: Users) {
    this.students_registered = this.students_registered.filter(item => item.studentId != member.studentId);
    this.students_registered = this.students_registered.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
    this.add_student_child.AddStudent(member);
  }

  RemoveAllStudent(event: any) {
    this.students_registered = [];
  }

  OnUpdate() {
    this.service.updateChannel(this.service.register_form.value, this.students_registered).subscribe(data => {
      if(data.ok) {
        console.log(data)
        this.alertService.addSuccess('Successfully Updated');
        this.router.navigate(['']);
      }
      else{
        this.alertService.addError(data.statusText);
      }
    })
  }

  OnNext(){
  }

  OnSubmit() {
  }

  getSantizeUrl(imgBlob : Blob) {

    if(!imgBlob) {
      return null;
    }

    const url = window.URL || window.webkitURL;
    let imgurl = url.createObjectURL(imgBlob)
    return this.sanitizer.bypassSecurityTrustUrl(imgurl);
}

}
