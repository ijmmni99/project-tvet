import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { Users } from '../models/users';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class GraphService {

  pipe = new DatePipe('en-US');
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

  async getListMembers(teamid: any) {
    let members: Array<Users> = [];

    try{
      let result = await this.graphClient
      .api(`/teams/${teamid}/members`)
      .get();

      console.log(result)

      result.value.forEach((element: MicrosoftGraph.AadUserConversationMember) => {
        members.push({
          studentId: element.userId,
          name: element.displayName,
          messageCount: 0
        })
      })

      console.log(members);
      return members;
    }
    catch (error) {
      console.log(error)
      this.alertsService.addError('Could not get List Channel', JSON.stringify(error, null, 2));
    }

    return members;
  }

  async getListMessage(id: any, channelID: any) {

    let chats: Array<Users> = [];
    var myCurrentDate = new Date();
    var myPastDate = new Date(myCurrentDate);
    myPastDate.setDate(myPastDate.getDate() - 14);

    console.log(myPastDate);

    try {  
        // let result = await this.graphClient
        // .api(`/teams/${id}/channels/${channelID}/messages/delta`).filter(`lastModifiedDateTime gt ${myPastDate.toISOString()}`)
        // .get();

        let result = await this.graphClient
        .api(`/teams/${id}/channels/${channelID}/messages`)
        .get();

        //let test =  await this.graphClient.api(`teams/${id}/channels/${channelID}/messages/1638961389492/replies`).get()

        //console.log(test);
        

      console.log(result)
      let loop: boolean = true;
      let data: Array<MicrosoftGraph.ChatMessage> = result.value;
      do
      {
        if(result['@odata.nextLink'] == undefined)
          loop = false;
        else
        {
          result = await this.graphClient.api(result['@odata.nextLink']).get();
          console.log(result)
          data = data.concat(result.value)
        }
      }
      while(loop == true)
      
      // const dateNow = new Date();
      // const dateNowMinusEightHours = new Date(new Date(dateNow).getDate() - 1000 * 60 * 60 * 8)
      // console.log(dateNow)

      data.forEach((element: MicrosoftGraph.ChatMessage) => {
        if(!chats.find(x => x.studentId == element.from?.user?.id)){
            chats.push({
            studentId: element.from?.user?.id,
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