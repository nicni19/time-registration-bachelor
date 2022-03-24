import { IAuthHandler } from './interfaces/IAuthHandler';
import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { MicrosoftAuthHandler } from './MicrosoftAuthHandler';
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

import graphTest from '../graphTest.json';

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
    authHandler: IAuthHandler = new MicrosoftAuthHandler();
    
    constructor(){};

    insertLogElement(){

    }
    

    authTest(){
        console.log(this.authHandler.authenticate(graphTest.id,graphTest.token));
    }

}