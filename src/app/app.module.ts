import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgAnimatedBorderModule } from 'ng-animated-border'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { OAuthSettings } from '../oauth';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { ChannelRegisterComponent } from './components/channel-register/channel-register.component';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { NotesComponent } from './components/notes/notes.component';
import { UpdateChannelComponent } from './components/update-channel/update-channel.component';
import { DialogComponent } from './components/dialog/dialog.component';

let msalInstance: IPublicClientApplication | undefined = undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance = msalInstance ?? new PublicClientApplication({
    auth: {
      authority: OAuthSettings.authority,
      clientId: OAuthSettings.appId,
      redirectUri: OAuthSettings.redirectUri,
      postLogoutRedirectUri: OAuthSettings.redirectUri,
      knownAuthorities: [OAuthSettings.authority]
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true,
      secureCookies: true
    }
  });

  return msalInstance;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertsComponent,
    SpinnerComponent,
    ChannelsComponent,
    LeaderboardsComponent,
    ChannelRegisterComponent,
    AddChannelComponent,
    AddStudentComponent,
    MeetingsComponent,
    NotesComponent,
    UpdateChannelComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    MsalModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgAnimatedBorderModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [ {
    provide: MSAL_INSTANCE,
    useFactory: MSALInstanceFactory
  },
  {
    provide: MatDialogRef,
    useValue: {}
  },
  MsalService],
  bootstrap: [AppComponent]
})
export class AppModule { }