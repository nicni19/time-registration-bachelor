import { LogElement } from "../domain/LogElement";
import { TimerRun } from "../domain/TimerRun";

export interface IDatabaseHandler{

    getPreferences(id:String):{};

    getLogElements(queryArguments:String[]);

    insertLogElement(logArray: LogElement[]): Promise<any>;

    deleteLogElements(logIDs: number[]);

    insertTimerRun(runArray: TimerRun[]);

    getTimerRuns(queryArguments: string[]);

    deleteTimerRun(runIDs:number[]): string;

    getLastGraphMailLookup(userID:string):Promise<string>;

    setLastGraphMailLookup(userID:string, timestamp:string);

    getLastGraphCalendarLookup(userID:string):Promise<string>;

    setLastGraphCalendarLookup(userID:string, timestamp:string);

}
