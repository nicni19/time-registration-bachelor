import { IDatabaseHandler } from "./IDatabaseHandler";


export interface IGraphHandler {

    updateDatabase(databaseHandler: IDatabaseHandler, authToken: String):{};
}