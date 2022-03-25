import express from "express";
import { IDatabaseHandler } from "../interfaces/IDatabaseHandler";
import { IGraphHandler } from "../interfaces/IGraphHandler";
const request = require('request');
const { htmlToText } = require('html-to-text');


export class GraphCalendarHandler implements IGraphHandler {
    graphUrl: string;

    constructor(){

    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: String): Promise<any>{
        return await this.fetchCalendarEvents(authToken);   
    }

    async fetchCalendarEvents(authToken: String): Promise<any> {
        let lastLookup: string = '202022-01-16T01:03:21.347Z';
        let responseJson = {'events': []};

        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/events?$select=subject,body,start,end&$filter=lastModifiedDateTime%20ge%' + lastLookup, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (!body.value) {
            return body
            }
            

            for (let i = 0; i < body.value.length; i++) {
            let event: string = htmlToText(body.value[i].body.content, {
                wordWrap: false,
            })

            let startTime = ((body.value[i].end.dateTime).replace(/-/g,'/'));
            let dateTime = new Date(startTime.replace('T', ' '));
            
            let jsonElement = {
                'id': body.value[i].id,
                'description': body.value[i].subject + ': ' + event,
                'startTime': body.value[i].start.dateTime,
                'duration': dateTime.valueOf() 
            }

            responseJson.events.push(jsonElement);
            }
            resolve(responseJson);
        }).auth(null, null, true, authToken)
        }).then(() => {
            return responseJson;
        });
        
    }

}