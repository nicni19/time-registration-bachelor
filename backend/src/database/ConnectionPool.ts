import * as azureConfig from "./config/azureconfig.json"
import { DBConnection } from "./DBConnection";
import { Request } from 'tedious'

export class ConnectionPool {
    connections = [];
    minCon: number;
    maxCon: number;
    config;
    tal = 0;

    constructor(config, minCon: number, maxCon: number){
      this.config = config;
      this.minCon = minCon;
      this.maxCon = maxCon;

      let minutesToCloseCon = 15, intervalClose = minutesToCloseCon * 60 * 1000; 
      let minutesToPingDB = 30, intervalPingDB = minutesToPingDB * 60 * 1000; 

      setInterval(this.deleteConnections.bind(this),intervalClose)
      setInterval(this.pingDB.bind(this),intervalPingDB)
      }

    async initConnections() {
      for (let i = 0; i < this.minCon; i++) {
        
        let connection: DBConnection = new DBConnection(this.config);
        connection = await connection.connectToDB();
        
        this.connections.push(connection);
      }
    }

    async deleteConnections() {

      console.log("Connections before: ",this.connections.length, this.tal);
      
      let conAmount = this.connections.length;
      if (conAmount > this.minCon) {
        for (let i: number = 0; i < conAmount-this.minCon; i++) {
          let connection = await this.connections.pop();
          connection.getConnection().close();
        }
      }
      console.log("Connections after: ",this.connections.length);

      this.tal++;
    }

    pingDB() {
      for (let i: number = 0; i < this.connections.length; i++) {
        if (!this.connections[i].getIsLocked() && this.connections[i].getConnection().state.name == "LoggedIn") {
          this.connections[i].setIsLocked(true);
          const request : Request = new Request(
            "SELECT TOP (0) * FROM [dbo].[log_elements]", (err) => {
              if(err){
                console.log(err.message)
              }
            });

            this.connections[i].getConnection().execSql(request);

            request.on('requestCompleted',()=>{
              this.connections[i].setIsLocked(false);
            })   
        }
      }
    }

    async getFreeConnection(): Promise<DBConnection> {
      console.log(this.connections.length);

      let connection = null;

      for (let i: number = 0; i < this.connections.length; i++) {
        console.log(this.connections[i].getConnection().state);
        
        //this.connections[i] = await this.connections[i].restartConnectionIfClosed();

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
      } else if (this.connections.length < this.maxCon) {
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