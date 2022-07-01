import { IDatabaseHandler } from "./IDatabaseHandler";


export interface IGraphHandler {
    /**
     * Fetch data from Graph and send this data to the database handler
     * @param databaseHandler An implementation of the IDatabaseHandler interface
     * @param authToken A Microsoft access token
     * @param userID A Microsoft user ID
     */
    updateDatabase(databaseHandler: IDatabaseHandler, authToken: string, userID: string): Promise<boolean>;
}