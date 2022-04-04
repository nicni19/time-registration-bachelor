import * as azureConfig from "./config/azureconfig.json"
import { request } from 'express';
import { Connection, Request } from 'tedious'
import { LogElement } from '../common/domain/LogElement';
import { TimerRun } from '../common/domain/TimerRun';
import { IDatabaseHandler } from '../common/interfaces/IDatabaseHandler';
//import { squel } from 'sequel';

export class AzureSQLDatabaseHandler implements IDatabaseHandler{

  azureConfig = require('./config/azureconfig.json');
  squel = require('squel');
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
  //TODO: Fjern, den skal egentligt ikke bruges længere, tror jeg..?
  async query(queryString:string){
    let returnJson = {"elements":[]}
    console.log(queryString);

    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err, rowCount) => {
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
          returnJson.elements.push(jsonElement);
          resolve(returnJson);
        });
        
        console.log(returnJson);
      }).then(()=>{return returnJson});
  }

  async testQuery() {
    let returnJson = {"elements":[]}

    //this.squel.SELECT().from("test");
    //console.log(this.squel.select().from("students").toString())

    return await new Promise((resolve,reject) => {
    const request : Request = new Request(
      this.squel.select().from("test").toString(), (err, rowCount) => {
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
        returnJson.elements.push(jsonElement);
        resolve(returnJson);
      });
      
      console.log(returnJson);
    }).then(()=>{return returnJson});
  
  }

  getPreferences(id: String): {} {
    throw new Error('Method not implemented.');
    
  }
  /**
   * 
   * @param queryArguments TODO: Currently only supports user_id as query parameter..
   * @returns a JSON element containing all fetched elements
   */
  async getLogElements(queryArguments: String[]) {
    let queryString = this.squel.select().from('log_elements').where("user_id = " + "'" + queryArguments[0].toString() + "'").toString();
    console.log(queryString);

    let returnJson = {"elements":[]}

    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err, rowCount) => {
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
          returnJson.elements.push(jsonElement);
        });

        request.on('requestCompleted',()=>{
          console.log("Completed")
          console.log(returnJson)
          resolve(returnJson);
        })
        
        //console.log(returnJson);
    }).then(()=>{return returnJson});
  }
  
  async insertLogElement(logArray: LogElement[]): Promise<any> {
    let array = [];

    return await new Promise((resolve,reject) => {
      for (let i: number = 0; i < logArray.length; i++) {
        array.push({ 
          user_id: logArray[i].getUserID(),
          element_description: logArray[i].getDescription(),
          start_timestamp: logArray[i].getStartTimestamp(),
          duration: logArray[i].getDuration(),
          internal_task: +logArray[i].getInternalTask(),
          unpaid: +logArray[i].getUnpaid(),
          rit_num: logArray[i].getRitNum(),
          case_num: logArray[i].getCaseNum(),
          case_task_num: logArray[i].getCaseTaskNum(),
          customer: logArray[i].getCustomer(),
          edited: +logArray[i].getEdited(),
          book_keep_ready: +logArray[i].getBookKeepReady(),
          calendar_id: logArray[i].getCalendarid(),
          mail_id: logArray[i].getMailid()
        })
      }    

        //Created query string by using SQUEL
        let queryString = this.squel.insert()
          .into('log_elements')
          .setFieldsRows(array)
          .toString() 

      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      );     
      this.connection.execSql(request);
      resolve(true);
    }).then(() => {
      return true;
  });

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
  async getLastGraphMailLookup(userID: string): Promise<string> {
    let queryString = this.squel.select('last_mail_lookup').from('users').where('id = ' + "'" + userID + "'");
    let returnString = "";
    return await new Promise((resolve) =>{
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      );
  
      request.on("row", columns => {
        columns.forEach(column => {
          returnString = column.value;
        });
        resolve(returnString)
      });
      this.connection.execSql(request)
    }).then(()=>{return returnString});    
  }

  setLastGraphMailLookup(userID: string, timestamp: string) {
    let queryString = this.squel.update().table('users').set('last_mail_lookup',timestamp).where('id = ' + "'" + userID + "'");
    const request : Request = new Request(
      queryString, (err) => {
        if(err){
          console.log(err.message)
        }
      }
    );
    this.connection.execSql(request)
  }

  async getLastGraphCalendarLookup(userID: string): Promise<string> {
    let queryString = this.squel.select('last_calendar_lookup').from('users').where('id = ' + "'" + userID + "'");
    let returnString = "";
    return await new Promise((resolve) =>{
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      );
      request.on("row", columns => {
        columns.forEach(column => {
          returnString = column.value;
        });
        resolve(returnString)
      });
      this.connection.execSql(request)
    }).then(()=>{return returnString});
  }

  setLastGraphCalendarLookup(userID: string, timestamp: string) {
    let queryString = this.squel.update().table('users').set('last_calendar_lookup',timestamp).where('id = ' + "'" + userID + "'");
    const request : Request = new Request(
      queryString, (err) => {
        if(err){
          console.log(err.message)
        }
      }
    );
    this.connection.execSql(request)
  }
}