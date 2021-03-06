import { Connection, Request } from 'tedious'

/**
 * Wrapper class containing a connection object to the MS SQL Server database.
 */
export class DBConnection {
  connection;
  config;
  isLocked: boolean = false;

  constructor(config){
    this.config = config;
    this.connection = new Connection(config);
  }

  async connectToDB(): Promise<DBConnection> {
    return new Promise(async (resolve,reject) => {
      await this.connection.on("connect", err => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          console.log("User Jondog connected to Azure database");
          resolve(this.connection)
        }
      });

      this.connection.connect();
      
    }).then(()=>{return this});
  }

  async restartConnectionIfClosed() {
    this.connection.on("end", err => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Restarting");
        
        return this.connection.connectToDB();
      }
    });

    return this;
  }

  getConnection() {
    return this.connection;
  }

  setIsLocked(isLocked:boolean) {
    this.isLocked = isLocked;
  }

  getIsLocked():boolean {
    return this.isLocked;
  }
}