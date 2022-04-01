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


export class Core{
    
    databaseHandler: AzureSQLDatabaseHandler = new AzureSQLDatabaseHandler();
    authHandler: IAuthHandler = new MicrosoftAuthHandler();
    graphMap = new Map();
    
    constructor(){
        this.graphMap.set('mail', new GraphMailHandler as IGraphHandler);
        this.graphMap.set('calendar', new GraphCalendarHandler as IGraphHandler);
    };

    async authenticateUser(userID:string,token:string){
        return await this.authHandler.authenticate(userID,token);
    }

    insertLogElement(){
    }
    
    async authTest(){
        return await this.authHandler.authenticate(graphTest.id,graphTest.token);
    }

    async azureTest(){
        //return this.azureDatabase.testQuery();
        //this.azureDatabase.insertLogElement(elements);
        //return await this.databaseHandler.getLogElements(['6fc4dcd488b119e7']);
        //this.databaseHandler.setLastGraphMailLookup('6fc4dcd488b119e7',BigInt(1648797418669));
        console.log(await this.databaseHandler.getLastGraphCalendarLookup('6fc4dcd488b119e7'))
    }

    async graphUpdate(userID: string, authToken: string) {
        //Todo: Get preferences from database
        let prefArray = ['mail','calendar'];

        let logElements: LogElement[] = [];
        
        for (let i: number = 0; i < prefArray.length; i++) {
            try {
                logElements.push(await this.graphMap.get(prefArray[i]).updateDatabase(this.azureDatabase, authToken, userID));
            } catch (error) {
                return error;
            } 
        }

        for (let i: number = 0; i < logElements.length; i++) {
            let log: LogElement = logElements[i];
        }
        console.log(logElements);

        return logElements;
    }



}