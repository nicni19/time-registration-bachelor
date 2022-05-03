import * as azureConfig from "./config/azureconfig.json"
import { DBConnection } from "./DBConnection";
import { Request } from 'tedious'

export class ConnectionPool {
    connections = [];
    minCon: number;
    maxCon: number;
    connectionAmount: number = 0;
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
        this.connectionAmount++;
        }
    }

    async getFreeConnection(): Promise<DBConnection> {
      console.log("Connections in pool: ", this.connectionAmount);
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
      } else {
        let connection: DBConnection = new DBConnection(this.config);
        connection = await connection.connectToDB();
        console.log("jjjj");
        

        let conIndex = this.connections.push(connection)-1;
        this.connectionAmount++;
        return this.connections[conIndex];
      }

    }

    async executeRequest(request) {
      let connection = await this.getFreeConnection();



      connection.getConnection().execSql(request);
    }

    returnConnection(conIndex) {
      this.connections[conIndex].setIsLocked(false);
    }

}