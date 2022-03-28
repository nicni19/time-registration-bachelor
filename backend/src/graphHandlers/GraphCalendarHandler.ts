import express from "express";
import { LogElement } from "../common/domain/LogElement";
import { IDatabaseHandler } from "../common/interfaces/IDatabaseHandler";
import { IGraphHandler } from "../common/interfaces/IGraphHandler";
const request = require('request');
const { htmlToText } = require('html-to-text');


export class GraphCalendarHandler implements IGraphHandler {
    graphUrl: string;

    constructor(){

    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string, userID: string): Promise<any>{
        return await this.fetchCalendarEvents(authToken, userID);   
    }

    async fetchCalendarEvents(authToken: string, userID: string): Promise<any> {
        let lastLookup: string = '202022-01-16T01:03:21.347Z';
        let logElements: LogElement[] = [];

        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/events?$select=subject,body,start,end&$filter=lastModifiedDateTime%20ge%' + lastLookup, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (!body.value) {
                reject(body);
                return body;
            }

            for (let i = 0; i < body.value.length; i++) {
            let event: string = htmlToText(body.value[i].body.content, {
                wordWrap: false,
            })

            let startTime = ((body.value[i].end.dateTime).replace(/-/g,'/'));
            let dateTime = new Date(startTime.replace('T', ' '));
            let description = body.value[i].subject + ': ' + event;

            let logElement: LogElement = new LogElement(userID, 'Calendar', null, description, startTime, dateTime.valueOf(), null, null, null, null, null, body.value[i].id, null);
            logElements.push(logElement);

            }
            resolve(logElements);
        }).auth(null, null, true, authToken)
        }).then(() => {
            return logElements;
        });
        
    }

}