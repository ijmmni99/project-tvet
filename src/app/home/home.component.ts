import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import {DOCUMENT, Location} from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { GraphService } from '../services/graph.service';
import { Router } from '@angular/router';
import { AlertsService } from '../services/alerts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  page:number = 1;
  channelChoose: boolean = false;
  loading: boolean = false;
  showMyClass: boolean = false;

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get isStudent(): boolean {
    return this.authService.isStudent
  }

  isDarkMode: boolean = true;
  private currentTheme = 'light';
  
  constructor(public router: Router, private authService: AuthService, private location: Location, private alertService: AlertsService
    ,@Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) { }

  ngOnInit() {
    // this.loading = true;
    // this.authService.getUser().then(_ => {
    //   this.authService.user = _;
    //   this.loading = false;
    // })

    this.currentTheme = localStorage.getItem('activeTheme') || 'light';

    this.isDarkMode = this.currentTheme == 'light' ? false : true;
    this.renderer.setAttribute(this.document.body, 'data-theme', this.currentTheme);
  }

  async signIn(): Promise<void> {
    await this.authService.signIn()
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

  home() {
    this.router.navigateByUrl('/');
  }

  clickEvent() {
    this.showMyClass = this.showMyClass ? false : true;
  }

  switchMode() {
    
    if(this.isDarkMode){
      this.currentTheme = 'light';
      this.isDarkMode = false;
    }
    else{
      this.currentTheme = 'dark';
      this.isDarkMode = true;
    }
    
    localStorage.setItem('activeTheme', this.currentTheme);
    
    this.renderer.setAttribute(this.document.body, 'data-theme', this.currentTheme);
  }
}