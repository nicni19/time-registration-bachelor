import { IDatabaseHandler } from "./IDatabaseHandler";


export interface IGraphHandler {

    //todo: Should be void; Return type added for testing
    updateDatabase(databaseHandler: IDatabaseHandler, authToken: String): any;
}