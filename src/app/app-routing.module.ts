import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { ChannelRegisterComponent } from './components/channel-register/channel-register.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { NotesComponent } from './components/notes/notes.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: ChannelsComponent },
  { path: 'leaderboards', component: LeaderboardsComponent },
  { path: 'meetings', component: MeetingsComponent},
  { path: 'register-channel', component: ChannelRegisterComponent},
  { path: 'add-channel', component: AddChannelComponent},
  { path: 'notes', component: NotesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
