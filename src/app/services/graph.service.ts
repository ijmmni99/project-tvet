import { Injectable, SecurityContext } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { Users } from '../models/users';
import { DatePipe } from '@angular/common';
import { Channel } from '../models/channel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GraphService {

  pipe = new DatePipe('en-US');
  private graphClient: Client;
  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private http: HttpClient) {

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

  async getPhoto(members: Users[]){
    try {

      members.forEach(async (element) =>  {
        let result = await this.graphClient
        .api(`/users/${element.studentId}/photo/$value`)
        .get();

        console.log(result)
        element.imgUrl = result
      })

      return members;

    } catch (error) {
      this.alertsService.addError('Failed : ' + error);
    }

    return members;
  }

  async getTeamPhoto(teamsID: string){
    try {
      const token = await this.authService.getAccessToken()
          .catch((reason) => {
            this.alertsService.addError('Failed : ' + reason);
          });

        if (token)
        {
          let response = await this.http.get(`https://graph.microsoft.com/beta/teams/${teamsID}/photo/$value`, {
            headers: {
              'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
          }).toPromise().then(response => {
            console.log(response)
            return response;
          })

          if(response) {
            return response
          }
          else
            return null
          

        } else {
          this.alertsService.addError('Failed : ');
          return null
        }
      //return result;

    } catch (error) {
      this.alertsService.addError('Failed : ' + error);
      return null
      
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
          messageCount: 0,
          messageAskCount: 0,
          imgUrl: new Blob
        })
      })

      return members;
    }
    catch (error) {
      console.log(error)
      this.alertsService.addError('Could not get List Channel', JSON.stringify(error, null, 2));
    }

    return members;
  }


  async getListMeeting(channel: Channel, startDate: Date, all: boolean) {
    let data: Array<MicrosoftGraph.ChatMessage> = [];
    try {
      
      let result: any;
      
      if(all){
        result = await this.graphClient
        .api(`/teams/${channel.teamsID}/channels/${channel.channelID}/messages/delta`)
        .get();
      }
      else {
        result = await this.graphClient
        .api(`/teams/${channel.teamsID}/channels/${channel.channelID}/messages/delta`).filter(`lastModifiedDateTime gt ${startDate.toISOString()}`)
        .get();
      }
      

      console.log(result)

      let loop: boolean = true;
      data = result.value;
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

      data = data.filter(element => element.messageType == "unknownFutureValue");
      
      return data;

    } catch (error) {
      this.alertsService.addError('Error while fetching Meeting List', JSON.stringify(error, null, 2))
    }

    return data;
  }

  async getListMessage(channel: Channel, meetingID: any) {

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
        .api(`/teams/${channel.teamsID}/channels/${channel.channelID}/messages/${meetingID}/replies`)
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

      data = data.filter(element => element.messageType == "message");

      let filterData = channel.students!.map(item => { return item.studentId; });
      data = data.filter(item => filterData.includes(item.from?.user?.id));

      data.forEach((element: MicrosoftGraph.ChatMessage) => {
        if(!chats.find(x => x.studentId == element.from?.user?.id)){
            chats.push({
            studentId: element.from?.user?.id,
            name: element.from?.user?.displayName,
            messageCount: data.filter(y => y.from?.user?.id == element.from?.user?.id).length,
            messageAskCount: data.filter(y => y.from?.user?.id == element.from?.user?.id && y.body?.content?.includes('?')).length,
            imgUrl: new Blob()
          });
        }
      });

      channel.students!.forEach(element => {
        if(!chats.find(x => x.studentId == element.studentId)) {
          chats.push({
              studentId: element.studentId,
              name: element.name,
              messageCount: data.filter(y => y.from?.user?.id == element.studentId).length,
              messageAskCount: data.filter(y => y.from?.user?.id == element.studentId&& y.body?.content?.includes('?')).length,
              imgUrl: new Blob()
          })
        }
      });

      chats = chats.sort((a, b) => b.messageCount - a.messageCount);

      this.getPhoto(chats).then(_ => {
        return _;
      });

    } catch (error) {

      this.alertsService.addError('Could not get List Channel', JSON.stringify(error, null, 2));

    }
    
    return chats;
  }
}