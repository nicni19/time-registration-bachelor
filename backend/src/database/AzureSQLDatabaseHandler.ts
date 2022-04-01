import { Connection, Request } from 'tedious';
import { LogElement } from '../common/domain/LogElement';
import { TimerRun } from '../common/domain/TimerRun';
import { IDatabaseHandler } from '../common/interfaces/IDatabaseHandler';
import * as azureConfig from "./config/azureconfig.json"

export class AzureSQLDatabaseHandler implements IDatabaseHandler{

  connection : Connection;

  constructor(){
    this.connection = new Connection(this.config);
    
    this.connection.on("connect", err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("User " + "'" + azureConfig.username + "' connected to Azure database");
      }
    });

    this.connection.connect();
  }

  config = {
    authentication: {
      options: {
        userName: azureConfig.username,
        password: azureConfig.password
      },
      type: "default"
    },
    server: "jondog.database.windows.net",
    options: {
      database: "TimeRegistrationSystem",
      encrypt: true,
      trustServerCertificate:true
    }
  
  };

  async testQuery() {
    let returnJson = {"array":[]}

    return await new Promise((resolve,reject) => {
    const request : Request = new Request(
      'SELECT * FROM test', (err, rowCount) => {
        if(err){
          console.log(err.message)
        }
      }
    );

      this.connection.execSql(request);

      request.on("row", columns => {
        let jsonElement = {}
        columns.forEach(column => {
          jsonElement[column.metadata.colName] = column.value;
        });
        returnJson.array.push(jsonElement);
        resolve(returnJson);
      });
      
      console.log(returnJson);
    }).then(()=>{return returnJson});
  
  }

  getPreferences(id: String): {} {
    throw new Error('Method not implemented.');
  }
  getLogElements(queryArguments: String[]) {
    throw new Error('Method not implemented.');
  }
  insertLogElement(logArray: LogElement[]) {

  }
  deleteLogElements(logIDs: number[]) {
    throw new Error('Method not implemented.');
  }
  insertTimerRun(runArray: TimerRun[]) {
    throw new Error('Method not implemented.');
  }
  getTimerRuns(queryArguments: string[]) {
    throw new Error('Method not implemented.');
  }
  deleteTimerRun(runIDs: number[]): string {
    throw new Error('Method not implemented.');
  }
  getLastGraphMailLookup(userID: string): string {
    return '2022-01-01T08:50:19.308Z';  
  }
  setLastGraphMailLookup(userID: string, timestamp: string) {
  
  }
  getLastGraphCalendarLookup(userID: string): string {
    return '2022-01-01T08:50:19.308Z';
  }
  setLastGraphCalendarLookup(userID: string, timestamp: string) {

  }
  
}