import { IAuthHandler } from './interfaces/IAuthHandler';
import { MicrosoftAuthHandler } from './MicrosoftAuthHandler';
import { GraphCalendarHandler } from '../graphHandlers/GraphCalendarHandler';
import { GraphMailHandler } from '../graphHandlers/GraphMailHandler';
import { IGraphHandler } from './interfaces/IGraphHandler';
import { LogElement } from './domain/LogElement';
import { AzureSQLDatabaseHandler } from '../database/AzureSQLDatabaseHandler';
import { Actions } from './domain/Actions';
import { JsonConverter } from './JsonConverter';
import { IDatabaseHandler } from './interfaces/IDatabaseHandler';

/**
 * The main class of the backend service, used by the API to perform the actions on the different endpoints.
 * 
 */
export class Core{
    
    databaseHandler: IDatabaseHandler = new AzureSQLDatabaseHandler();
    authHandler: IAuthHandler = new MicrosoftAuthHandler(this.databaseHandler);
    jsonConverter = new JsonConverter();

    mailHandler: IGraphHandler;
    calendarHandler: IGraphHandler;
    
    //Instantiates the Graph Handlers to be used
    constructor(){
        this.mailHandler = new GraphMailHandler as IGraphHandler;
        this.calendarHandler = new GraphCalendarHandler as IGraphHandler;
    };

    async authenticateUser(userID:string,token:string): Promise<boolean>{
        return await this.authHandler.authenticate(userID,token);
    }

    async doesUserExist(userid: string): Promise<boolean> {
        return await this.databaseHandler.isUserInDatabase(userid);
    }


    async insertLogElements(json): Promise<boolean>{
        let logMap = this.jsonConverter.convertJSONToLogElements(json)
        let newInserted = await this.databaseHandler.insertLogElement(logMap.get('New'));
        let oldUpdated = await this.databaseHandler.updateLogElement(logMap.get('Old'));

        if (newInserted && oldUpdated) {
            return true;
        } else {
            return false;
        }
    }

    deleteLogElements(ids: number[],userID:string): Promise<boolean>{
        return this.databaseHandler.deleteLogElements(ids,userID);
    }

    async getLogElements(queryMap: Map<string,any>): Promise<LogElement[]> {
        return this.databaseHandler.getLogElements(queryMap);
    }

    /**
     * Fetches the user preferences from the database and uses these to determine if lookup on
     * Outlook mail / calendar should be performed
     * @param userID Microsoft user ID
     * @param authToken Microsoft access token
     * @returns returns true if successful
     */
    async graphUpdate(userID: string, authToken: string): Promise<boolean> {
        
        let prefJson = await this.getPreferences(userID);
        let prefArray = [];

        let promises: Array<Promise<boolean>> = [];
        
        if(prefJson.preferences[1].calendar_enabled.value){
            prefArray.push('calendar')
            promises.push(this.calendarHandler.updateDatabase(this.databaseHandler, authToken, userID));
        }
        if(prefJson.preferences[0].mail_enabled.value){
            prefArray.push('mail')
            promises.push(this.mailHandler.updateDatabase(this.databaseHandler, authToken, userID));
        }

        let results : Array<boolean> = await Promise.all(promises);
        let graphSuccess = results.every((value) => value);

        return graphSuccess;
    }

    
    async authorizeUser(userID:string,action:Actions): Promise<boolean>{
        return await this.authHandler.authorize(userID,action);
    }
    
    async getPrivileges(userID:string): Promise<any>{
        return await this.databaseHandler.getPrivileges(userID);
    }

    async getPreferences(userID:string): Promise<any>{
        return await this.databaseHandler.getPreferences(userID)
    }

    async updatePreferences(userID:string,preferences:boolean[]){
        this.databaseHandler.updatePreferences(userID,preferences)
    }
}