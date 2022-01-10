import { Injectable } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import { AlertsService } from './alerts.service';
import { OAuthSettings } from '../../oauth';
import { User } from '../models/user';
import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public authenticated: boolean;
  public authUser: AccountInfo;
  public isStudent: boolean;
  //public user?: User;

  constructor(private msalService: MsalService, private alertsService: AlertsService) {
    this.authenticated = this.msalService.instance.getAllAccounts().length > 0;
    this.authUser = this.msalService.instance.getAllAccounts()[0]!;
    //6ykc6n
    if(this.authUser){
      if(this.authUser.username.includes('6ykc6n'))
        this.isStudent = true
      else
        this.isStudent = false;
    }
    else
      this.isStudent = false;
    // this.getUser().then(data=> {
    //   this.user = data
    // })
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(OAuthSettings)
      .toPromise()
      .catch((reason) => {
        this.alertsService.addError('Login failed : ' + reason);
      });

    if (result) {
      this.authenticated = true;
      this.authUser = result.account!;

      if(this.authUser.username.includes('6ykc6n'))
        this.isStudent = true
      else
        this.isStudent = false;

      this.alertsService.addSuccess("Successfully Login");
      //this.user = await this.getUser();
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await this.msalService.logout().toPromise();
    //this.user = undefined;
    this.authenticated = false;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    const acc = this.msalService.instance.getAllAccounts()[0];
    const result = await this.msalService
      .acquireTokenSilent({
        scopes: OAuthSettings.scopes,
        account: acc
      })
      .toPromise()
      .catch((reason) => {
        this.alertsService.addError('Get token failed', JSON.stringify(reason, null, 2));
      });

    if (result) {
      return result.accessToken;
    }

    // Couldn't get a token
    this.authenticated = false;
    return '';
  }

  async getUser(): Promise<User | undefined> {
    if (!this.authenticated) return undefined;
  
    const graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async(done) => {
        const token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });
  
        if (token)
        {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  
    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await graphClient
      .api('/me')
      .get();
  
    const user = new User();
    user.displayName = graphUser.displayName ?? '';
    // Prefer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
    user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';
    user.id = graphUser.id?? '';
    // Use default avatar
    user.avatar =  '/assets/no-profile-photo.png';

    if(user.email.includes('student'))
      user.isStudent = true;
    else
      user.isStudent = false;
      
    return user;
  }
}