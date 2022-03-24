import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
    
    constructor(){};

    insertLogElement(){

    }

}