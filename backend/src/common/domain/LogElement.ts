export class LogElement{
    
    private id:number;
    private userID:string;
    private type:string;
    private customer:string;
    private description:string;
    private startTimestamp:number;
    private duration:number;
    private internalTask:boolean;
    private unpaid:boolean;
    private edited:boolean;
    private bookKeepReady:boolean;
    private ritNum:number;
    private caseNum:string;
    private caseTaskNum:number;
    private calendarid: number;
    private mailid: number;

    constructor( 
        userID: string, 
        type: string, 
        customer: string = null, 
        description: string = null, 
        startTimestamp: number, 
        duration: number, 
        internalTask: boolean, 
        unpaid: boolean,
        edited:boolean,
        bookKeepReady:boolean, 
        ritNum: number = null, 
        caseNum: string = null, 
        caseTaskNum: number = null,
        calendarid: number = null,
        mailid: number = null,
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
        this.edited = edited
        this.bookKeepReady = bookKeepReady
        this.ritNum = ritNum
        this.caseNum = caseNum
        this.caseTaskNum = caseTaskNum
        this.calendarid = calendarid
        this.mailid = mailid
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

    public getStartTimestamp():number{
        return this.startTimestamp;
    }

    public setStartTimestamp(start:number){
        this.startTimestamp = start;
    }

    public getDuration():number{
        return this.duration;
    }

    public setDuration(duration:number){
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

    public getEdited(){
        return this.edited;
    }

    public setEdited(edited:boolean){
        this.edited = edited;
    }

    public getBookKeepReady(){
        return this.bookKeepReady;
    }

    public setBookKeepReady(bookKeepReady:boolean){
        this.bookKeepReady = bookKeepReady;
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

    public getCalendarid(): number {
        return this.calendarid;
    }
    public setCalendarid(value: number) {
        this.calendarid = value;
    }

    public getMailid(): number {
        return this.mailid;
    }
    public setMailid(value: number) {
        this.mailid = value;
    }
}