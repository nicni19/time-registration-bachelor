import { IAuthHandler } from './interfaces/IAuthHandler';
import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { MicrosoftAuthHandler } from './MicrosoftAuthHandler';
import { GraphCalendarHandler } from './GraphHandlers/GraphCalendarHandler';
import { GraphMailHandler } from './GraphHandlers/GraphMailHandler';
import { IGraphHandler } from './interfaces/IGraphHandler';
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

import graphTest from '../graphTest.json';

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
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


    async graphUpdate(userID: string, authToken: string) {
        //Todo: Get preferences from database
        let prefArray = ['mail','calendar'];

        let jsonResponse = {}
        
        for (let i: number = 0; i < prefArray.length; i++) {
            try {
                jsonResponse[prefArray[i]] = await this.graphMap.get(prefArray[i]).updateDatabase(this.databaseHandler, authToken);
            } catch (error) {
                return error;
            }
                
            
        }

        return jsonResponse;
    }

}