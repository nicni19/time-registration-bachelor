import { LogElement } from "../domain/LogElement";
import { TimerRun } from "../domain/TimerRun";

export interface IDatabaseHandler{

    getPreferences(userid:String):{};

    getPrivileges(userID:string):Promise<any>;
    
    getLogElements(queryArguments:Map<string,any>);

    insertLogElement(logArray: LogElement[]): Promise<any>;
    
    updateLogElement(logArray: LogElement[]): Promise<boolean>;

    insertFromGraph(logArray: LogElement[]): Promise<any>;

    deleteLogElements(logIDs: number[], userID:string): Promise<boolean>;

    insertTimerRun(runArray: TimerRun[]);

    getTimerRuns(queryArguments: string[]): TimerRun[];

    deleteTimerRun(runIDs:number[]): string;

    getLastGraphMailLookup(userID:string):Promise<string>;

    setLastGraphMailLookup(userID:string, timestamp:string);

    getLastGraphCalendarLookup(userID:string):Promise<string>;

    setLastGraphCalendarLookup(userID:string, timestamp:string);

    isUserInDatabase(userID:string): Promise<boolean>;

    updatePreferences(userID:string,preferences:boolean[]);

}
