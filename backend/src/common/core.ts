import { GraphCalendarHandler } from './GraphHandlers/GraphCalendarHandler';
import { GraphMailHandler } from './GraphHandlers/GraphMailHandler';
import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { IGraphHandler } from './interfaces/IGraphHandler';
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
    graphMap = new Map();
    
    constructor(){
        this.graphMap.set('mail', new GraphMailHandler as IGraphHandler);
        this.graphMap.set('calendar', new GraphCalendarHandler as IGraphHandler);
    };

    insertLogElement(){

    }

    async graphUpdate(userID: string, authToken: string) {
        //Todo: Get preferences from database
        let prefArray = ['mail','calendar'];

        let jsonFile = require('data.json');

        let jsonResponse = {}
        
        for (let i: number = 0; i < prefArray.length; i++) {
            jsonResponse[prefArray[i]] = await this.graphMap.get(prefArray[i]).updateDatabase(this.databaseHandler, authToken);
        }

        return jsonResponse;
    }

}