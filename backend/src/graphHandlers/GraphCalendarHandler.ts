import express from "express";
import { LogElement } from "../common/domain/LogElement";
import { IDatabaseHandler } from "../common/interfaces/IDatabaseHandler";
import { IGraphHandler } from "../common/interfaces/IGraphHandler";
import { Type } from "../common/domain/Type"

const request = require('request');
const { htmlToText } = require('html-to-text');


export class GraphCalendarHandler implements IGraphHandler {
    graphUrl: string;
    lastLookup: string;

    constructor(){
    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string, userID: string): Promise<any>{
        this.lastLookup = await databaseHandler.getLastGraphCalendarLookup(userID);

        let logElements: LogElement[] = await this.fetchCalendarEvents(authToken, userID);
        
        let calendarSuccess: boolean = await databaseHandler.insertFromGraph(logElements)
        .then(databaseHandler.setLastGraphCalendarLookup(userID, new Date(Date.now()).toISOString()));

        return calendarSuccess;
    }

    async fetchCalendarEvents(authToken: string, userID: string): Promise<any> {
        let logElements: LogElement[] = [];
        console.log(this.lastLookup);

        return await new Promise((resolve,reject) => {
            request.get("https://graph.microsoft.com/v1.0/me/events?$select=subject,body,start,end&$filter=lastModifiedDateTime%20ge%20" + this.lastLookup + "%20and%20categories/any(s:s%20ne%20'PRIVATE')", { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (!body.value) {
                reject(body);
                return body;
            }

            for (let i = 0; i < body.value.length; i++) {
                let event: string = htmlToText(body.value[i].body.content, {
                    wordWrap: false,
                })

                let startTimeString = ((body.value[i].start.dateTime).replace(/-/g,'/'));
                let timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
                let startTime = new Date(startTimeString.replace('T', ' ')).getTime() - timeZoneOffset;
                console.log(startTimeString)
                console.log(startTime)
                let endTime = new Date((body.value[i].end.dateTime).replace('T', ' ')).getTime() - timeZoneOffset;
                let duration: number = endTime - startTime;
                let description = body.value[i].subject + ': ' + event;

                let logElement: LogElement = new LogElement(userID, Type.CalendarEvent, description, startTime, duration, false, false, "","",0,"", false, false, body.value[i].id, null);
                logElements.push(logElement);

            }
            resolve(logElements);
        }).auth(null, null, true, authToken)
        }).then(() => {
            let newLookup: Date = new Date(Date.now());
            this.lastLookup = newLookup.toISOString();
            return logElements;
        });       
    }

}