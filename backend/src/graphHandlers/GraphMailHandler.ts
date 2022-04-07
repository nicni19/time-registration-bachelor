import { LogElement } from "../common/domain/LogElement";
import { IDatabaseHandler } from "../common/interfaces/IDatabaseHandler";
import { IGraphHandler } from "../common/interfaces/IGraphHandler";
import { Type } from "../common/domain/Type"
const request = require('request');

export class GraphMailHandler implements IGraphHandler {
    graphUrl: string;
    lastLookup: string;

    constructor(){
    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string, userID: string): Promise<boolean> {
        this.lastLookup = await databaseHandler.getLastGraphMailLookup(userID);
        let logElements: LogElement[]

        try {
            logElements = await this.fetchMailEvents(authToken, userID);
        } catch (err) {
            return err;
        } finally {
            databaseHandler.insertLogElement(logElements)
            .then(databaseHandler.setLastGraphMailLookup(userID, new Date(Date.now()).toISOString())
            );
        }

        return true;
    }

    async fetchMailEvents(authToken, userID: string): Promise<any> {
        let logElements: LogElement[] = [];


        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/messages?$select=subject,toRecipients,sentDateTime&$filter=lastModifiedDateTime%20ge%20' + this.lastLookup, { json: true }, (err, res, body) => {
            if (err) { throw err }
            if (!body.value) {
                reject(false);
                throw err;
            }

            for (let i = 0; i < body.value.length; i++) {

                let startTime = new Date((body.value[i].sentDateTime).replace('T', ' ')).getTime();
                let description = "Reciever: " + body.value[i].toRecipients[0].emailAddress.address + ", Subject: " + body.value[i].subject;

                let logElement: LogElement = new LogElement(userID, Type.Mail, description, startTime, null, null, null, null, null, null, null, false, false, null, body.value[i].id)
                logElements.push(logElement);
                
            }
            resolve(logElements);
        }).auth(null, null, true, authToken)
        }).then(() => {
            return logElements;
        });
        
        
    }
}