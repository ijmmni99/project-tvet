import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  total: number = 0;
  @Input() teamid: any;
  @Output('addStudentData') addStudentData = new EventEmitter<any>();

  constructor(private graphService: GraphService) { }

  ngOnInit(): void {
    this.graphService.getListMembers(this.teamid).then(data => {
      this.chats = data;
    });
  }

  OnSubmit(){

  }

  AddToMember(member: any){
    this.chats.splice(this.chats.indexOf(member), 1);
    this.total = this.total +1;
    this.addStudentData.emit(member)
  }

}
