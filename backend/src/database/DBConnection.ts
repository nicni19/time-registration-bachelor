import { Connection, Request } from 'tedious'


export class DBConnection {
  connection;
  config;

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
        return this.connection.connectToDB();
      }
    });

    return this;
  }

  getConnection() {
    return this.connection;
  }
}