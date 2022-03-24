import { LogElement } from "../domain/LogElement";
import { TimerRun } from "../domain/TimerRun";

export interface IDatabaseHandler{

    getPreferences(id:String):{};

    getLogElements(queryArguments:String[]);

    insertLogElement(logArray: LogElement[]);

    deleteLogElements(logIDs: number[]);

    insertTimerRun(runArray: TimerRun[]);

    getTimerRuns(queryArguments: string[]);

    deleteTimerRun(runIDs:number[]): string;

    getLastGraphMailLookup(userID:string):string;

    setLastGraphMailLookup(userID:string, timestamp:string);

    getLastGraphCalendarLookup(userID:string):string;

    setLastGraphCalendarLookup(userID:string, timestamp:string);

}
