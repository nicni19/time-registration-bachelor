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
    
    constructor(){
        this.graphMap.set('mail', new GraphMailHandler as IGraphHandler);
        this.graphMap.set('calendar', new GraphCalendarHandler as IGraphHandler);
    };

    async authenticateUser(userID:string,token:string){
        return await this.authHandler.authenticate(userID,token);
    }

    async doesUserExist(userid: string): Promise<boolean> {
        return await this.databaseHandler.isUserInDatabase(userid);
    }


    insertLogElements(json){
        this.databaseHandler.insertLogElement(this.convertJSONToLogElements(json));
    }

    async getLogElements(queryMap: Map<string,any>): Promise<LogElement[]> {
        return this.databaseHandler.getLogElements(queryMap);
    }
    
    async authTest(){
        return await this.authHandler.authenticate(graphTest.id,graphTest.token);
    }

    async azureTest(){
        //return this.azureDatabase.testQuery();
        //this.azureDatabase.insertLogElement(elements);
        //return await this.databaseHandler.getLogElements(['6fc4dcd488b119e7']);
        //this.databaseHandler.setLastGraphMailLookup('6fc4dcd488b119e7',BigInt(1648797418669));
        return await this.databaseHandler.getLastGraphCalendarLookup('6fc4dcd488b119e7');
    }

    async graphUpdate(userID: string, authToken: string): Promise<boolean> {
        //Todo: Get preferences from database
        let prefArray = ['mail','calendar'];

        console.log(new Date(Date.now()).toISOString());
        
        for (let i: number = 0; i < prefArray.length; i++) {
            try {
                await this.graphMap.get(prefArray[i]).updateDatabase(this.databaseHandler, authToken, userID);
            } catch (error) {
                console.log(error);
                return false;
            } 
        }

        return true;
    }

    
    async authorizeUser(userID:string,action:Actions){
        return await this.authHandler.authorize(userID,action);
    }
    
    async getPrivileges(userID:string){
        return await this.databaseHandler.getPrivileges(userID);
    }

    convertJSONToLogElements(json) {
        let log_elements: LogElement[] = [];

        for (let i: number = 0; i < json.log_elements; i++) {
            log_elements.push(new LogElement(json.log_elements[i].userID, json.log_elements[i].type, json.log_elements[i].description, 
                json.log_elements[i].startTimestamp, json.log_elements[i].duration, json.log_elements[i].internalTask, json.log_elements[i].unpaid,
                json.log_elements[i].ritNum, json.log_elements[i].caseNum, json.log_elements[i].caseTaskNum, json.log_elements[i].customer,
                json.log_elements[i].edited, json.log_elements[i].bookKeepReady, json.log_elements[i].calendarid, json.log_elements[i].mailid,
                json.log_elements[i].id))
        }

        return log_elements;
    }





}