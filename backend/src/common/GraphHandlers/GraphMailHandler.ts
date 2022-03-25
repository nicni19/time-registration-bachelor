import { IDatabaseHandler } from "../interfaces/IDatabaseHandler";
import { IGraphHandler } from "../interfaces/IGraphHandler";
const request = require('request');

export class GraphMailHandler implements IGraphHandler {
    graphUrl: string;

    constructor(){

    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string): Promise<any> {
        return await this.fetchMailEvents(authToken);
    }

    async fetchMailEvents(authToken): Promise<any> {
        let lastLookup: string = '202022-01-16T01:03:21.347Z';
        let responseJson = {'events': []};


        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/messages?$select=subject,toRecipients&$filter=lastModifiedDateTime%20ge%' + lastLookup, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (!body.value) {
                console.log(body)
                return body
            }
            

            for (let i = 0; i < body.value.length; i++) {

            
            let jsonElement = {
                'id': body.value[i].id,
                'description': body.value[i].subject
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