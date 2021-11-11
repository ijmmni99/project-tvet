import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root'
})

export class GraphService {

  
  private graphClient: Client;
  constructor(
    private authService: AuthService,
    private alertsService: AlertsService) {

    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service
        const token = await this.authService.getAccessToken()
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
  }

  async getCalendarView(start: string, end: string, timeZone: string): Promise<MicrosoftGraph.Event[] | undefined> {
    try {
      const result =  await this.graphClient
        .api('/me/calendarview')
        .header('Prefer', `outlook.timezone="${timeZone}"`)
        .query({
          startDateTime: start,
          endDateTime: end
        })
        .select('subject,organizer,start,end')
        .orderby('start/dateTime')
        .top(50)
        .get();

      return result.value;
    } catch (error) {
      this.alertsService.addError('Could not get events', JSON.stringify(error, null, 2));
    }
    return undefined;
  }

  async addEventToCalendar(newEvent: MicrosoftGraph.Event): Promise<void> {
    try {
      // POST /me/events
      await this.graphClient
        .api('/me/events')
        .post(newEvent);
    } catch (error) {
      throw Error(JSON.stringify(error, null, 2));
    }
  }

  async getPhoto(){
    try {
      const result = await this.graphClient
        .api('/me/photo')
        .get();
      
      console.log(result)
    } catch (error) {
      this.alertsService.addError('Could not get Photo', JSON.stringify(error, null, 2));
    }
  }

  async getListChannel(id: any){

    let chats: Array<Users> = [];
    
    try {
      const result = await this.graphClient
        .api(`/teams/${id}/channels`)
        .get();
        
      const result2 = await this.graphClient
        .api(`/teams/${id}/channels/${result.value[2].id}/messages`)
        .get();

      let data: Array<MicrosoftGraph.ChatMessage> = result2.value;
      

      data.forEach((element: MicrosoftGraph.ChatMessage) => {
            if(!chats.find(x => x.id == element.from?.user?.id)){
                chats.push({
                id: element.from?.user?.id,
                name: element.from?.user?.displayName,
                messageCount: data.filter(y => y.from?.user?.id == element.from?.user?.id).length
            });
          }
      });

        
      chats = chats.sort((a, b) => b.messageCount - a.messageCount);
      
      return chats;

    } catch (error) {

      this.alertsService.addError('Could not get List Channel', JSON.stringify(error, null, 2));

    }
    
    return chats;
  }
}