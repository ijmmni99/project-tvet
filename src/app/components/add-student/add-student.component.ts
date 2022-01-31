import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Users } from 'src/app/models/users';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  chats: Array<Users> = [];
  page:number = 1;
  channelChoose: boolean = false;
  dataSource: any[] | undefined;
  loading: boolean = false;
  selectAll: boolean = false;
  @Input() teamid: any;
  @Input() students_registered: Array<Users> = [];
  @Output('addStudentData') addStudentData = new EventEmitter<any>();
  @Output('removeStudentAllData') removeStudentAllData = new EventEmitter<any>();
  @Output('addStudentAllData') addStudentAllData = new EventEmitter<Users[]>();

  constructor(private graphService: GraphService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loading = true;
    this.graphService.getListMembers(this.teamid).then(data => {
      let filterData = this.students_registered.map(item => { return item.studentId; });
      this.chats = data.filter(item => !filterData.includes(item.studentId));
      this.graphService.getPhoto(this.chats).then(_ => {
        this.chats = _;
        this.chats = this.chats.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
        this.loading = false;
      })
    });
  }

  OnSubmit(){

  }

  AddToMember(member: any){
    this.addStudentData.emit(member)
    this.chats = this.chats.filter(item => item.studentId != member.studentId);
  }

  AddStudent(member: Users){
    this.chats.push(member)
    this.chats = this.chats.sort((a, b) => a.name!.toLowerCase().localeCompare(b.name!.toLowerCase()))
  }

  AddAllStudent(){
    this.addStudentAllData.emit(this.chats);
    this.selectAll = true;
    this.chats = []
  }

  RemoveAllStudent(){
    this.removeStudentAllData.emit();
    this.selectAll = false;
    this.ngOnInit();
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
