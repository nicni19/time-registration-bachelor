export class LogElement{
    
    private id:number;
    private userID:string;
    private type:string;
    private customer:string;
    private description:string;
    private startTimestamp:bigint;
    private duration:bigint;
    private internalTask:boolean;
    private unpaid:boolean;
    private ritNum:number;
    private caseNum:string;
    private caseTaskNum:number;


    constructor( 
        userID: string, 
        type: string, 
        customer: string, 
        description: string, 
        startTimestamp: bigint, 
        duration: bigint, 
        internalTask: boolean, 
        unpaid: boolean, 
        ritNum: number, 
        caseNum: string, 
        caseTaskNum: number,
        id?: number,
    ) {
        this.id = id
        this.userID = userID
        this.type = type
        this.customer = customer
        this.description = description
        this.startTimestamp = startTimestamp
        this.duration = duration
        this.internalTask = internalTask
        this.unpaid = unpaid
        this.ritNum = ritNum
        this.caseNum = caseNum
        this.caseTaskNum = caseTaskNum
    };
    
    
    public getId() : number {
        return this.id;
    }

    public setID(id:number){
        this.id = id;
    }
    
    public getUserID():string{
        return this.userID;
    }

    public setUserID(userID:string){
        this.userID = userID;
    }

    public getType():string{
        return this.type;
    }

    public setType(type:string){
        this.type = type;
    }

    public getCustomer():string{
        return this.customer;
    }

    public setCustomer(customer:string){
        this.customer = customer;
    }

    public getDescription():string{
        return this.description;
    }

    public setDescription(description:string){
        this.description = description;
    }

    public getStartTimestamp():bigint{
        return this.startTimestamp;
    }

    public setStartTimestamp(start:bigint){
        this.startTimestamp = start;
    }

    public getDuration():bigint{
        return this.duration;
    }

    public setDuration(duration:bigint){
        this.duration = duration;
    }

    public getInternalTask():boolean{
        return this.internalTask;
    }

    public setInternalTask(internalTask:boolean){
        this.internalTask = internalTask;
    }

    public getUnpaid():boolean{
        return this.unpaid;
    }

    public setUnpaid(unpaid:boolean){
        this.unpaid = unpaid;
    }

    public getRitNum():number{
        return this.ritNum;
    }

    public setRitNum(rit:number){
        this.ritNum = rit;
    }

    public getCaseNum():string{
        return this.caseNum;
    }

    public setCaseNum(caseNum:string){
        this.caseNum = caseNum;
    }

    public getCaseTaskNum():number{
        return this.caseTaskNum;
    }
}