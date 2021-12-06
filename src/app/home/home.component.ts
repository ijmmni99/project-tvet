import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { GraphService } from '../services/graph.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  page:number = 1;
  channelChoose: boolean = false;
  loading: boolean = false;

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get isStudent(): boolean {
    return this.authService.isStudent
  }

  constructor(public router: Router, private authService: AuthService, private location: Location) { }

  ngOnInit() {
    // this.loading = true;
    // this.authService.getUser().then(_ => {
    //   this.authService.user = _;
    //   this.loading = false;
    // })
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