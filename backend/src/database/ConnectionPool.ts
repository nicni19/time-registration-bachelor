import * as azureConfig from "./config/azureconfig.json"
import { DBConnection } from "./DBConnection";

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
      
      
      
      let con = this.connections.pop();
      
      if (con != null) { 
        //con = await con.restartConnectionIfClosed();
        return con;
      } else {
        let connection: DBConnection = new DBConnection(this.config);
        connection = await connection.connectToDB();
        console.log("jjjj");
        

        this.connections.push(connection);
        this.connectionAmount++;
        return this.getFreeConnection();
      }

    }

    returnConnection(connection) {
      this.connections.push(connection);
    }

}