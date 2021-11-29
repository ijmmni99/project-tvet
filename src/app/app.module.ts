import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgAnimatedBorderModule } from 'ng-animated-border'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { OAuthSettings } from '../oauth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { ChannelRegisterComponent } from './components/channel-register/channel-register.component';
import { AddChannelComponent } from './components/add-channel/add-channel.component';

let msalInstance: IPublicClientApplication | undefined = undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance = msalInstance ?? new PublicClientApplication({
    auth: {
      clientId: OAuthSettings.appId,
      redirectUri: OAuthSettings.redirectUri,
      postLogoutRedirectUri: OAuthSettings.redirectUri,
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
    NavBarComponent,
    HomeComponent,
    AlertsComponent,
    SpinnerComponent,
    ChannelsComponent,
    LeaderboardsComponent,
    ChannelRegisterComponent,
    AddChannelComponent
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
    HttpClientModule
  ],
  providers: [ {
    provide: MSAL_INSTANCE,
    useFactory: MSALInstanceFactory
  },
  MsalService],
  bootstrap: [AppComponent]
})
export class AppModule { }