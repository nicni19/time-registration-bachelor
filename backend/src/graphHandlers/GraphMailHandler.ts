import { LogElement } from "../common/domain/LogElement";
import { IDatabaseHandler } from "../common/interfaces/IDatabaseHandler";
import { IGraphHandler } from "../common/interfaces/IGraphHandler";
import { Type } from "../common/domain/Type"
const request = require('request');

/**
 * Implementation of the IGraphHandler interface.
 * This class handles the integration with Outlook mail through Graph.
 */
export class GraphMailHandler implements IGraphHandler {
    graphUrl: string;
    lastLookup: string; //A datetime string of the last lookup on the current users Calendar

    constructor(){
    }
    
    /**
     * Fetches the users lastLookup using the databaseHandler. The lastLookup value is used in the fetchMailEvents method.
     * The fetchMailEvents method is called with the user ID and access token, fetching all new mails sent by the user.
     * Then it tries to insert these into the database. If it succeeds, a lastLookup value is set in the database.
     * Finally it returns a boolean signifying if it failed or succeeded. 
     * @param databaseHandler Object for sending data to the database
     * @param authToken A Microsoft access token
     * @param userID A Microsoft user ID 
     * @returns True on success
     */
    async updateDatabase(databaseHandler: IDatabaseHandler, authToken: string, userID: string): Promise<boolean> {
        this.lastLookup = await databaseHandler.getLastGraphMailLookup(userID);
        
        let logElements: LogElement[] = await this.fetchMailEvents(authToken, userID);
    
        let mailSuccess: boolean = await databaseHandler.insertFromGraph(logElements)
        .then(databaseHandler.setLastGraphMailLookup(userID, new Date(Date.now()).toISOString()));

        return mailSuccess;
    }

    /**
     * Makes an HTTP GET request on Graph using the lastLookup to only fetch new events. 
     * It loops through all events from Graph and inserts the relevant data into a LogElement.
     * Each LogElement is then inserted into the LogElement array. 
     * @param authToken A Microsoft access token
     * @param userID A Microsoft user ID
     * @returns a LogElement array
     */
    async fetchMailEvents(authToken, userID: string): Promise<any> {
        let logElements: LogElement[] = [];


        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/mailFolders/SentItems/messages?$select=subject,toRecipients,sentDateTime&$filter=lastModifiedDateTime%20ge%20' + this.lastLookup, { json: true }, (err, res, body) => {
            if (err) { throw err }
            if (!body.value) {
                reject(false);
                throw err;
            }

            for (let i = 0; i < body.value.length; i++) {

                let startTime = new Date((body.value[i].sentDateTime).replace('T', ' ')).getTime();
                console.log(body.value[i].subject)
                let description = "Reciever: " + body.value[i].toRecipients[0].emailAddress.address + ", Subject: " + body.value[i].subject;

                let logElement: LogElement = new LogElement(userID, Type.Mail, description, startTime, 0, false, false, "", "", 0, "", false, false, null, body.value[i].id)
                logElements.push(logElement);
                
            }
            resolve(logElements);
        }).auth(null, null, true, authToken)
        }).then(() => {
            return logElements;
        });
        
        
    }
}