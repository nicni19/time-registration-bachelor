import * as azureConfig from "./config/azureconfig.json"
import { Connection, Request } from 'tedious'
import { LogElement } from '../common/domain/LogElement';
import { TimerRun } from '../common/domain/TimerRun';
import { IDatabaseHandler } from '../common/interfaces/IDatabaseHandler';
import { Type } from "../common/domain/Type";
import { ConnectionPool } from "./ConnectionPool";

/**
 * Concrete implementation of the IDatabaseHandler interface.
 * Used to interact with a Microsoft SQL Server database based on the credentials found in
 * the config folder -> azureconfig.json
 */
export class AzureSQLDatabaseHandler implements IDatabaseHandler{

  azureConfig = require('./config/azureconfig.json');
  squel = require('squel');
  TYPES = require('tedious').TYPES;
  connectionPool;

  constructor(){
    this.connectionPool = new ConnectionPool(this.config, 3,15);
    this.connectionPool.initConnections();
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
            console.log("isUserInDatabase: ", err.message)
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
          resolve(userExist);
        })

        this.connectionPool.executeRequest(request);

      }).then(()=>{return userExist}).catch((err)=>{
        return err;
      });
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
            console.log("getLogElements: ",err.message)
          }
        }
      );
      if (queryArguments.get('startTime') != null && queryArguments.get('endTime') != null) {
        request.addParameter('startTime', this.TYPES.BigInt, queryArguments.get('startTime').valueOf());
        request.addParameter('endTime', this.TYPES.BigInt, queryArguments.get('endTime').valueOf());
      }
        

        request.addParameter('userid', this.TYPES.VarChar, queryArguments.get('userid'));
        
        console.log(queryString);

        

        this.connectionPool.executeRequest(request);
        
        request.on("row", columns => {
          let startTimestamp:number = parseInt(columns['start_timestamp'].value,10);
          let duration:number = parseInt(columns['duration'].value,10);
          
          let logElement: LogElement = new LogElement(columns['user_id'].value,Type[columns['element_type'].value as keyof typeof Type],
          columns['element_description'].value,startTimestamp,duration,columns['internal_task'].value,
          columns['unpaid'].value,columns['rit_num'].value,columns['case_num'].value,columns['case_task_num'].value,columns['customer'].value,
          columns['edited'].value,columns['book_keep_ready'].value,columns['calendar_id'].value,columns['mail_id'].value,columns['id'].value)
          logElements.push(logElement);
        });

        request.on('requestCompleted',()=>{
          resolve(logElements);
        })
        
        //console.log(returnJson);
    }).then(()=>{return logElements}).catch((err)=>{
      return err;
    });
  }
  
  async insertLogElement(logArray: LogElement[]): Promise<boolean> {
    let array = [];
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
          edited: 1,
          book_keep_ready: +logArray[i].getBookKeepReady(),
          calendar_id: logArray[i].getCalendarid(),
          mail_id: logArray[i].getMailid()
        })
      }    

        //Created query string by using SQUEL
        let queryString = this.squel.insert()
          .into('log_elements')
          .setFieldsRows(array)
          .toString();

      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log("insertLogElement: ",err.message)
            success = false;
            reject(false)
          }
        }
      );

      this.connectionPool.executeRequest(request);
      success = true;
      resolve(true);
    }).then(() => {
      return success;
  }).catch((err)=>{
    return err;
  });

  }

  async getLogElementById(id): Promise<LogElement> {
    let queryString: string;
    
    queryString = this.squel.select().from('log_elements').where("id = @id").toString();

    let logElement: LogElement;
    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log("getLogElementById: ", err.message)
          }
        }
      );
        

        request.addParameter('id', this.TYPES.Int, id);

        this.connectionPool.executeRequest(request);
        
        request.on("row", columns => {
          let startTimestamp:number = parseInt(columns['start_timestamp'].value,10);
          let duration:number = parseInt(columns['duration'].value,10);
          
          logElement = new LogElement(columns['user_id'].value,Type[columns['element_type'].value as keyof typeof Type],
          columns['element_description'].value,startTimestamp,duration,columns['internal_task'].value,
          columns['unpaid'].value,columns['rit_num'].value,columns['case_num'].value,columns['case_task_num'].value,columns['customer'].value,
          columns['edited'].value,columns['book_keep_ready'].value,columns['calendar_id'].value,columns['mail_id'].value,columns['id'].value)
          
        });

        request.on('requestCompleted',()=>{
          resolve(logElement);
        })
        
        //console.log(returnJson);
    }).then(()=>{return logElement}).catch((err)=>{
      return err;
    });
  }

  isSame(logElementx: LogElement, logElementy: LogElement): boolean {
    return JSON.stringify(logElementx) == JSON.stringify(logElementy);
  }

  async updateLogElement(logArray: LogElement[]): Promise<boolean> {
    let array = []
    let idArray: number[] = []

    for (let i: number = 0; i < logArray.length; i++) {
      if (logArray[i].getEdited() == false) {
        let logElement: LogElement = await this.getLogElementById(logArray[i].getId())
        if (logElement != null) {

        }
        let isSame:boolean = this.isSame(logArray[i], logElement);
        if (isSame) {
          continue;
        }
        logArray[i].setEdited(true);
      }
      idArray.push(logArray[i].getId());
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

    return this.updateHelper(0,array,idArray);
  }

  async updateHelper(index:number, array,idArray): Promise<boolean> {
    let success: boolean;

    console.log(idArray[index]);
    
    return await new Promise((resolve,reject) => {
      
        let queryString = this.squel.update()
          .table('log_elements')
          .setFields(array[index])
          .where("id = @id")
          .toString();

        const request : Request = new Request(
          queryString, (err) => {
            if(err){
              console.log("updateHelper: ", err.message)
              success = false;
              reject(false)
            }
          }
        );
        

        request.addParameter('id', this.TYPES.Int, idArray[index]);
  
        this.connectionPool.executeRequest(request);

        request.on('requestCompleted',()=>{
          this.updateHelper(index+1,array,idArray);
        })  
        

      success = true;
      resolve(true);
    }).then(() => {
      return success;
  }).catch((err)=>{
    return err;
  });
  }

  async deleteLogElements(logIDs: number[], userID:string): Promise<boolean> {
    let success: boolean;
    let queryString = this.squel.delete()
      .from("log_elements")
      .where("id IN ? AND user_id = @userid", logIDs)
      .toString();

    return await new Promise((resolve,reject) => {
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log("deleteLogElements: ", err.message)
            success = false;
            reject(false)
          }
        }
      );  

      request.addParameter('userid', this.TYPES.VarChar, userID);

      this.connectionPool.executeRequest(request);

      success = true;
      resolve(true);

    }).then(() => {
      return success;
  }).catch((err)=>{
    return err;
  });

  }

  insertTimerRun(runArray: TimerRun[]) {
    throw new Error('Method not implemented.');
  }

  getTimerRuns(queryArguments: string[]): TimerRun[] {
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
            console.log("getLastGraphMailLookup: ", err.message)
          }
        }
      );
  
      request.on("row", columns => {
        returnString = columns['last_mail_lookup'].value;
        
        resolve(returnString)
      });

      this.connectionPool.executeRequest(request);
      
    }).then(()=>{return returnString}).catch((err)=>{
      return err;
    });    
  }

  async setLastGraphMailLookup(userID: string, timestamp: string) {
    let queryString = this.squel.update().table('users').set('last_mail_lookup',timestamp).where('id = ' + "'" + userID + "'");
    const request : Request = new Request(
      queryString, (err) => {
        if(err){
          console.log("setLastGraphMailLookup: ", err.message)
        }
      }
    );
    this.connectionPool.executeRequest(request);
  }

  async getLastGraphCalendarLookup(userID: string): Promise<string> {
    let queryString = this.squel.select('last_calendar_lookup').from('users').where('id = ' + "'" + userID + "'");
    let returnString = "";

    return await new Promise((resolve) =>{
      const request : Request = new Request(
        queryString, (err) => {
          if(err){
            console.log("getLastGraphCalendarLookup: ", err.message)
          }
        }
      );
      request.on("row", columns => {
          returnString = columns['last_calendar_lookup'].value;
        
        resolve(returnString)
      });

      this.connectionPool.executeRequest(request);
    }).then(()=>{return returnString}).catch((err)=>{
      return err;
    });
  }

  async setLastGraphCalendarLookup(userID: string, timestamp: string) {
    let queryString = this.squel.update().table('users').set('last_calendar_lookup',timestamp).where('id = ' + "'" + userID + "'");
    const request : Request = new Request(
      queryString, (err) => {
        if(err){
          console.log("setLastGraphCalendarLookup: ", err.message)
        }
      }
    );
    this.connectionPool.executeRequest(request);
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
            console.log("graphInsert");
            
            console.log("insertFromGraph: ", err.message)
          }
        }
      );
      

      this.connectionPool.executeRequest(request);
      resolve(true);
    }).then(() => {
      return true;
  }).catch((err)=>{
    return err;
  });

  }

  
  async getPreferences(userID:string):Promise<any>{
    let queryString = this.squel.select()
      .from('preferences')
      .where('user_id = ' + "'" + userID + "'")
      .toString();

    let returnJson = {preferences:[]}
    return await new Promise(async(resolve,reject)=>{
      const request : Request = new Request(
        queryString,(err)=>{
          if(err){
            console.log("getPreferences: ", err.message)
          }
        }
      )
      request.on('row',columns =>{
        returnJson.preferences.push({
          'mail_enabled':columns['mail_enabled'],
        })
        returnJson.preferences.push({
          'calendar_enabled':columns['calendar_enabled']
        })
      })

      this.connectionPool.executeRequest(request)

      request.on('requestCompleted',()=>{
        resolve(returnJson);
      });
    }).then(async()=>{return await returnJson})
    .catch((err)=>{console.log(err)})
  }

  //this.squel.update().table('users').set('last_calendar_lookup',timestamp).where('id = ' + "'" + userID + "'");
  updatePreferences(userID:string,preferences:boolean[]){
    let queryString = this.squel.update().table('preferences').set('mail_enabled',+preferences[0]).set('calendar_enabled',+preferences[1]).where('user_id = ' + "'" + userID + "'").toString();
    console.log(queryString)
    const request : Request = new Request(
      queryString, (err) => {
        if(err){
          console.log("updatePreferences: ", err.message)
        }
      }
    );
    this.connectionPool.executeRequest(request);
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
            console.log("getPrivileges: ", err.message)
          }
        }
      )

      request.on('row',columns =>{
        Object.keys(columns).forEach(element => {
          if(element != "id" && element != "user_id"){
            privilegesMap.set(element,columns[element])
          }
        })
      })

      this.connectionPool.executeRequest(request);

      request.on('requestCompleted',()=>{
        resolve(privilegesMap);
      });
    }).then(async()=>{return await privilegesMap}).catch((err)=>{
      return err;
    })
    .catch((err)=>{console.log(err)});
  }

}