/**
 * Data class which represents a single timer run.
 * Currently not in use, as the timer functionality is not implemented.
 */
export class TimerRun{
    id:number;
    userID:string;
    type:string;
    isActive:boolean;
    startTime:bigint;
    lapStartTime: bigint;
    duration:bigint;


    constructor(userID: string,type: string,isActive: boolean,startTime: bigint,lapStartTime: bigint,duration: bigint,id?: number,) {
        this.id = id
        this.userID = userID
        this.type = type
        this.isActive = isActive
        this.startTime = startTime
        this.lapStartTime = lapStartTime
        this.duration = duration
    }

    public getID(){
        return this.id;
    }

    public setID(id:number){
        this.id = id;
    }

    public getUserID(){
        return this.userID;
    }

    public setUserID(userID:string){
        this.userID = userID;
    }

    public getType(){
        return this.type;
    }

    public setType(type:string){
        this.type = type;
    }

    public getIsActive(){
        return this.isActive;
    }

    public setIsActive(isActive:boolean){
        this.isActive = isActive;
    }

    public getStartTime(){
        return this.startTime;
    }

    public setStartTime(startTime:bigint){
        this.startTime = startTime;
    }

    public getlapStartTime(): bigint {
        return this.lapStartTime;
    }
    public setlapStartTime(value: bigint) {
        this.lapStartTime = value;
    }

    public getDuration(){
        return this.duration;
    }

    public setDuration(duration:bigint){
        this.duration = duration;
    }

    
    
}