import { Component, OnInit, ViewChild } from '@angular/core';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {Location} from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { GraphService } from '../services/graph.service';
import { Users } from '../models/users';
import { Collection } from 'ngx-pagination/dist/paginate.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  page:number = 1;
  channelChoose: boolean = false;
  winner = { name: '', img: ''};
  dataSource: any[] | undefined;
  loading: boolean = false;
  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user

  get user(): User | undefined {
    return this.authService.user
  }

  constructor(public router: Router, private authService: AuthService, private graphService: GraphService, private location: Location) { }

  ngOnInit() {
    this.loading = true;
    this.authService.getUser().then(_ => {
      this.authService.user = _;
      this.loading = false;
    })
  }

  async signIn(): Promise<void> {
    await this.authService.signIn().then(_ => {
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  channelRegister() {
    this.router.navigateByUrl('register-channel');
  }

  channelAdd() {
    this.router.navigateByUrl('add-channel');
  }

  back(){
    this.location.back();
  }
}