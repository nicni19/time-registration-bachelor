import { IDatabaseHandler } from "./interfaces/IDatabaseHandler";

export class SQLDatabaseHandler implements IDatabaseHandler{
    
    constructor(){}
    
    sayHello(): String {
        return "Hello!";
    }

    
}