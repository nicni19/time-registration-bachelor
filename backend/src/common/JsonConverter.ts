import { LogElement } from "./domain/LogElement";

export class JsonConverter{

  convertJSONToLogElements(json) {
    let logElements: LogElement[] = [];
    let newLogElements: LogElement[] = [];

    for (let i: number = 0; i < json.length; i++) {
        if (json[i].id != null) {
            logElements.push(new LogElement(json[i].userID, json[i].type, json[i].description, 
                json[i].startTimestamp, json[i].duration, json[i].internalTask, json[i].unpaid,
                parseInt(json[i].ritNum, 10), json[i].caseNum, parseInt(json[i].caseTaskNum,10), json[i].customer,
                json[i].edited, json[i].bookKeepReady, json[i].calendarid, json[i].mailid,
                json[i].id))
        } else {
            newLogElements.push(new LogElement(json[i].userID, json[i].type, json[i].description, 
                json[i].startTimestamp, json[i].duration, json[i].internalTask, json[i].unpaid,
                parseInt(json[i].ritNum, 10), json[i].caseNum, parseInt(json[i].caseTaskNum,10), json[i].customer,
                json[i].edited, json[i].bookKeepReady, json[i].calendarid, json[i].mailid,
                json[i].id))
        }
    }
    let logMap = new Map();
    
    logMap.set('Old', logElements);
    logMap.set('New', newLogElements);
  
    return logMap;
  }
}