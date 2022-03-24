import { IDatabaseHandler } from "../interfaces/IDatabaseHandler";
import { IGraphHandler } from "../interfaces/IGraphHandler";
const request = require('request');

export class GraphMailHandler implements IGraphHandler {
    graphUrl: string;

    constructor(){

    }
    
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string): Promise<any> {
        this.fetchMailEvents(function(err, data){
            if (!err) {
                console.log('data:')
                console.log(data);
                return data;
            } else {
                return err;
            } 
        }, authToken);

    }

    async fetchMailEvents(callback, authToken): Promise<any> {
        let lastLookup: string = '202022-01-16T01:03:21.347Z';
        let responseJson = {'events': []};
        console.log("Not inside request");



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
            console.log("Hej");
            console.log(responseJson);
            if (!err && res.statusCode == 200) {
                return callback(null, responseJson);
            }
            
        }).auth(null, null, true, authToken)
        
    }
}