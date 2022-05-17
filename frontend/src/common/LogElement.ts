import { Type } from "./Type";

export class LogElement{
    
    private id:number|undefined;
    private userID:string;
    private type:Type;
    private customer:string;
    private description:string;
    private startTimestamp:number;
    private duration:number;
    private internalTask:boolean;
    private unpaid:boolean;
    private edited:boolean;
    private bookKeepReady:boolean;
    private ritNum:string;
    private caseNum:string;
    private caseTaskNum:number;
    private calendarid: string | null;
    private mailid: string | null;

    constructor( 
        userID: string, 
        type: Type,
        description: string,
        startTimestamp: number, 
        duration: number, 
        internalTask: boolean, 
        unpaid: boolean,
        ritNum: string, 
        caseNum: string, 
        caseTaskNum: number,
        customer: string,
        edited:boolean,
        bookKeepReady:boolean, 
        calendarid: string | null,
        mailid: string | null,
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
    
    
    public getId() : number | undefined{
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

    public getType():Type{
        return this.type;
    }

    public setType(type:Type){
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

    public getRitNum():string{
        return this.ritNum;
    }

    public setRitNum(rit:string){
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

    public setCaseTaskNum(caseTaskNum:number){
        this.caseTaskNum = caseTaskNum;
    }

    public getCalendarid():string | null {
        return this.calendarid;
    }
    public setCalendarid(value: string) {
        this.calendarid = value;
    }
    public getMailid(): string | null {
        return this.mailid;
    }
    public setMailid(value: string) {
        this.mailid = value;
    }
}