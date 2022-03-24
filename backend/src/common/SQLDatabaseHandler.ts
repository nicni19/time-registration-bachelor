import { LogElement } from "./domain/LogElement";
import { TimerRun } from "./domain/TimerRun";
import { IDatabaseHandler } from "./interfaces/IDatabaseHandler";

export class SQLDatabaseHandler implements IDatabaseHandler{
    
    constructor(){}
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