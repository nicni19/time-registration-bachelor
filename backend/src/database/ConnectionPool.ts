import * as azureConfig from "./config/azureconfig.json"
import { DBConnection } from "./DBConnection";
import { Request } from 'tedious'

export class ConnectionPool {
    connections = [];
    minCon: number;
    maxCon: number;
    config;

    constructor(config, minCon: number, maxCon: number){
      this.config = config;
      this.minCon = minCon;
      this.maxCon = maxCon;

      }

    async initConnections() {
      for (let i = 0; i < this.minCon; i++) {
        
        let connection: DBConnection = new DBConnection(this.config);
        connection = await connection.connectToDB();
        
        this.connections.push(connection);
        }
    }

    async getFreeConnection(): Promise<DBConnection> {
      console.log(this.connections.length);

      let connection = null;

      for (let i: number = 0; i < this.connections.length; i++) {
        console.log(this.connections[i].getConnection().state.name);
        console.log(this.connections[i].getIsLocked());
        if (!this.connections[i].getIsLocked() && this.connections[i].getConnection().state.name == "LoggedIn") {
          console.log("im not locked");
          connection = this.connections[i];
          connection.setIsLocked(true);
          break;
        }
      }

      if (connection != null) { 
        //con = await con.restartConnectionIfClosed();
        return connection;
      } else if (this.connections.length > this.maxCon) {
        let connection: DBConnection = new DBConnection(this.config);
        connection = await connection.connectToDB();

        let conIndex = this.connections.push(connection)-1;
        return this.connections[conIndex];
      } else {
        throw "Maximum amount of connections reached and all connections in use." +
        " Please try again later or increase max connections"
      }

    }

    async executeRequest(request) {
      let connection = await this.getFreeConnection();
      connection.getConnection().execSql(request);
      connection.setIsLocked(false);
    }

    returnConnection(conIndex) {
      this.connections[conIndex].setIsLocked(false);
    }

}