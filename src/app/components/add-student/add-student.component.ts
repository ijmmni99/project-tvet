import { Component, Input, OnInit } from '@angular/core';
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
  winner: string = '';
  @Input() teamid: any;

  constructor(private graphService: GraphService) { }

  ngOnInit(): void {
    this.graphService.getListMembers(this.teamid).then(data => {
      this.chats = data;
    });
  }

  OnSubmit(){
    
  }

}
