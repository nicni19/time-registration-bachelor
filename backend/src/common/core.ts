import { IAuthHandler } from './interfaces/IAuthHandler';
import {IDatabaseHandler} from './interfaces/IDatabaseHandler'
import { MicrosoftAuthHandler } from './MicrosoftAuthHandler';
import { SQLDatabaseHandler } from './SQLDatabaseHandler'; 

import graphTest from '../graphTest.json';

export class Core{
    
    databaseHandler: IDatabaseHandler = new SQLDatabaseHandler();
    authHandler: IAuthHandler = new MicrosoftAuthHandler();
    
    constructor(){};

    async authenticateUser(userID:string,token:string){
        return await this.authHandler.authenticate(userID,token);
    }

    insertLogElement(){

    }
    

    async authTest(){
        return await this.authHandler.authenticate(graphTest.id,graphTest.token);
    }


}