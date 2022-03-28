import { LogElement } from "../common/domain/LogElement";
import { TimerRun } from "../common/domain/TimerRun";
import { IDatabaseHandler } from "../common/interfaces/IDatabaseHandler";

let conf = require('./config/mysqlconifg.js');
let mysql = require('mysql');
let con;

export class SQLDatabaseHandler implements IDatabaseHandler{ 

    
    constructor(){
        con = mysql.createConnection({
            host: conf.host,
            user: conf.user,
            password: conf.password
          });
          
          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
          });
    }
    insertLogElement(logArray: LogElement[]) {
        throw new Error("Method not implemented.");
    }
    deleteLogElements(logIDs: number[]) {
        throw new Error("Method not implemented.");
    }
    insertTimerRun(runArray: TimerRun[]) {
        throw new Error("Method not implemented.");
    }
    getTimerRuns(queryArguments: string[]) {
        throw new Error("Method not implemented.");
    }
    deleteTimerRun(runIDs: number[]): string {
        throw new Error("Method not implemented.");
    }
    getLastGraphMailLookup(userID: string): string {
        throw new Error("Method not implemented.");
    }
    setLastGraphMailLookup(userID: string, timestamp: string) {
        throw new Error("Method not implemented.");
    }
    getLastGraphCalendarLookup(userID: string): string {
        throw new Error("Method not implemented.");
    }
    setLastGraphCalendarLookup(userID: string, timestamp: string) {
        throw new Error("Method not implemented.");
    }

    getPreferences(id: String): {} {
        return {};
    }

    getLogElements(queryArguments: String[]) {
        return ["Hello World"];
    }

    
}