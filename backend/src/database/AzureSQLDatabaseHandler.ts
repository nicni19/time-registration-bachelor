import * as azureConfig from "./config/azureconfig.json"
import { request } from 'express';
import { Connection, Request } from 'tedious'
import { LogElement } from '../common/domain/LogElement';
import { TimerRun } from '../common/domain/TimerRun';
import { IDatabaseHandler } from '../common/interfaces/IDatabaseHandler';
import { Type } from "../common/domain/Type";
//import { squel } from 'sequel';

export class AzureSQLDatabaseHandler implements IDatabaseHandler{

  azureConfig = require('./config/azureconfig.json');
  squel = require('squel');
  TYPES = require('tedious').TYPES;
  connections = [];

  constructor(){
    this.connections = [new Connection(this.config), new Connection(this.config), new Connection(this.config), new Connection(this.config), new Connection(this.config), new Connection(this.config), new Connection(this.config)];

    for (let i: number = 0; i < this.connections.length; i++) {
      this.connections[i].on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
          let connectionNumber: number = i+1;
          console.log("User " + "'" + azureConfig.username + "' connected to Azure database, on connection: " + connectionNumber);
        }
      });
  
      this.connections[i].connect();
    }
    
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
      trustServerCertificate:true,
      useColumnNames:true
    }
  
  };
  //TODO: Fjern, den skal egentligt ikke bruges længere, tror jeg..?
  /*
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
  */

  async isUserInDatabase(userID: string): Promise<boolean> {
    let queryString: string;
    let userExist: boolean = false;

    queryString = this.squel.select().from('users').where("id = @userid").toString();
    console.log(queryString);
    console.log(userID);
    
    

    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        });
        request.addParameter('userid', this.TYPES.VarChar, userID);
        
        

        request.on("row", columns => {
          if (columns['id'] != null) {
            userExist = true;
          } else {
            userExist = false;
          }
        });

        request.on('requestCompleted',()=>{
          console.log("Completed")
          console.log(userExist);
          resolve(userExist);
        })

        this.connections[6].execSql(request);

      }).then(()=>{return userExist});
  }

  getPreferences(id: String): {} {
    throw new Error('Method not implemented.');
    
  }
  /**
   * 
   * @param queryArguments TODO: Currently only supports user_id as query parameter..
   * @returns a JSON element containing all fetched elements
   */
  async getLogElements(queryArguments: Map<string,any>) {
    let queryString: string;
    if (queryArguments.get('startTime') != null && queryArguments.get('endTime') != null) {
      queryString = this.squel.select().from('log_elements').where("user_id =  @userid").where("start_timestamp > @startTime and start_timestamp < @endTime").toString();
    } else {
      queryString = this.squel.select().from('log_elements').where("user_id =  @userid").toString();
    }

    let returnJson = {"elements":[]}
    let logElements: LogElement[] = [];

    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      );
      if (queryArguments.get('startTime') != null && queryArguments.get('endTime') != null) {
        request.addParameter('startTime', this.TYPES.BigInt, queryArguments.get('startTime').valueOf());
        request.addParameter('endTime', this.TYPES.BigInt, queryArguments.get('endTime').valueOf());
      }
        

        request.addParameter('userid', this.TYPES.VarChar, queryArguments.get('userid'));
        
        console.log(queryString);

        this.connections[0].execSql(request);
        
        request.on("row", columns => {
          let logElement: LogElement = new LogElement(columns['user_id'].value,Type[columns['element_type'].value as keyof typeof Type],
          columns['element_description'].value,columns['start_timestamp'].value,columns['duration'].value,columns['internal_task'].value,
          columns['unpaid'].value,columns['rit_num'].value,columns['case_num'].value,columns['case_task_num'].value,columns['customer'].value,
          columns['edited'].value,columns['book_keep_ready'].value,columns['calendar_id'].value,columns['mail_id'].value,columns['id'].value)
          logElements.push(logElement);
        });

        request.on('requestCompleted',()=>{
          console.log("Completed")
          console.log(logElements)
          resolve(logElements);
        })
        
        //console.log(returnJson);
    }).then(()=>{return logElements});
  }
  
  async insertLogElement(logArray: LogElement[]): Promise<any> {
    let array = [];
    console.log("log");
    let success: boolean;
    

    return await new Promise((resolve,reject) => {
      for (let i: number = 0; i < logArray.length; i++) {
        array.push({ 
          user_id: logArray[i].getUserID(),
          element_type: Type[logArray[i].getType().valueOf()],
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
            success = false;
            reject(false)
          }
        }
      );     
      this.connections[1].execSql(request);
      success = true;
      resolve(true);
    }).then(() => {
      return success;
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
        returnString = columns['last_mail_lookup'].value;
        
        resolve(returnString)
      });
      this.connections[2].execSql(request)
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
    this.connections[2].execSql(request)
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
          returnString = columns['last_calendar_lookup'].value;
        
        resolve(returnString)
      });
      this.connections[3].execSql(request)
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
    this.connections[3].execSql(request)
  }

  async insertFromGraph(logArray: LogElement[]): Promise<any> {
    let array = [];
    console.log("log");
    

    return await new Promise((resolve,reject) => {
      for (let i: number = 0; i < logArray.length; i++) {
        array.push({ 
          user_id: logArray[i].getUserID(),
          element_type: Type[logArray[i].getType().valueOf()],
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
          .into('temp_log_elements')
          .setFieldsRows(array)
          .toString() 

      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      );     
      this.connections[4].execSql(request);
      resolve(true);
    }).then(() => {
      return true;
  });

  }

  async getPrivileges(userID:string):Promise<any>{
    let queryString = this.squel.select()
      .from('action_permissions')
      .where('user_id = ' + "'" + userID + "'")
      .toString();

    let privilegesMap = new Map();

    return await new Promise(async (resolve,reject)=>{
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log(err.message)
          }
        }
      )
      /*
      request.on('columnMetadata',columns =>{
        Object.keys(columns).forEach(col => {
          if(col != "id" && col != "user_id"){
            privilegesMap.set(col,false);
          }
        })
      });
      */
      request.on('row',columns =>{
        Object.keys(columns).forEach(element => {
          if(element != "id" && element != "user_id"){
            privilegesMap.set(element,columns[element])
          }
        })
      })

      this.connections[5].execSql(request);

      request.on('requestCompleted',()=>{
        resolve(privilegesMap);
      });
    }).then(async()=>{return await privilegesMap})
    .catch((err)=>{console.log(err)});
  }

}