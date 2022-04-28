import { LogElement } from "../domain/LogElement";
import { TimerRun } from "../domain/TimerRun";

export interface IDatabaseHandler{

    getPreferences(id:String):{};

    getPrivileges(userID:string):Promise<any>;
    
    getLogElements(queryArguments:Map<string,any>);

    insertLogElement(logArray: LogElement[]): Promise<any>;

    insertFromGraph(logArray: LogElement[]): Promise<any>

    deleteLogElements(logIDs: number[]);

    insertTimerRun(runArray: TimerRun[]);

    getTimerRuns(queryArguments: string[]);

    deleteTimerRun(runIDs:number[]): string;

    getLastGraphMailLookup(userID:string):Promise<string>;

    setLastGraphMailLookup(userID:string, timestamp:string);

    getLastGraphCalendarLookup(userID:string):Promise<string>;

    setLastGraphCalendarLookup(userID:string, timestamp:string);

    isUserInDatabase(userID:string): Promise<boolean>;

}
