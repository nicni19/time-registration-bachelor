import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
    
    constructor(){};

    insertLogElement(){

    }

    sayHello(){
        console.log(this.databaseHandler.sayHello());
        return this.databaseHandler.sayHello();
    }
}