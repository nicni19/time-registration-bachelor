import { IAuthHandler } from './interfaces/IAuthHandler';
import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { MicrosoftAuthHandler } from './MicrosoftAuthHandler';
import { GraphCalendarHandler } from '../graphHandlers/GraphCalendarHandler';
import { GraphMailHandler } from '../graphHandlers/GraphMailHandler';
import { IGraphHandler } from './interfaces/IGraphHandler';
import { SQLDatabaseHandler } from '../database/SQLDatabaseHandler'; 

import graphTest from '../graphTest.json';
import { LogElement } from './domain/LogElement';
import { AzureSQLDatabaseHandler } from '../database/AzureSQLDatabaseHandler';
import { Actions } from './domain/Actions';


export class Core{
    
    databaseHandler: AzureSQLDatabaseHandler = new AzureSQLDatabaseHandler();
    authHandler: IAuthHandler = new MicrosoftAuthHandler(this.databaseHandler);
    graphMap = new Map();

    mailHandler: IGraphHandler;
    calendarHandler: IGraphHandler;
    
    constructor(){
        this.graphMap.set('mail', new GraphMailHandler as IGraphHandler);
        this.graphMap.set('calendar', new GraphCalendarHandler as IGraphHandler);

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
        let newInserted = await this.databaseHandler.insertLogElement(this.convertJSONToLogElements(json).get('New'));
        let oldUpdated = await this.databaseHandler.updateLogElement(this.convertJSONToLogElements(json).get('Old'));

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

    async graphUpdate(userID: string, authToken: string): Promise<boolean> {
        //Todo: Get preferences from database
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

    convertJSONToLogElements(json) {
        let logElements: LogElement[] = [];
        let newLogElements: LogElement[] = [];

        for (let i: number = 0; i < json.length; i++) {
            if (json[i].id != null) {
                logElements.push(new LogElement(json[i].userID, json[i].type, json[i].description, 
                    json[i].startTimestamp, json[i].duration, json[i].internalTask, json[i].unpaid,
                    parseInt(json[i].ritNum, 10), json[i].caseNum, parseInt(json[i].caseTaskNum,10), json[i].customer,
                    json[i].edited, json[i].bookKeepReady, json[i].calendarid, json[i].mailid,
                    json[i].id))
            } else {
                newLogElements.push(new LogElement(json[i].userID, json[i].type, json[i].description, 
                    json[i].startTimestamp, json[i].duration, json[i].internalTask, json[i].unpaid,
                    parseInt(json[i].ritNum, 10), json[i].caseNum, parseInt(json[i].caseTaskNum,10), json[i].customer,
                    json[i].edited, json[i].bookKeepReady, json[i].calendarid, json[i].mailid,
                    json[i].id))
            }
        }
        let logMap = new Map();
        
        
        
        logMap.set('Old', logElements);
        logMap.set('New', newLogElements);

        return logMap;
    }





}