import { Actions } from "./domain/Actions";
import { IAuthHandler } from "./interfaces/IAuthHandler";
import express from 'express';
import { IDatabaseHandler } from "./interfaces/IDatabaseHandler";
const request = require('request');

export class MicrosoftAuthHandler implements IAuthHandler{
    
    private databaseHandler:IDatabaseHandler;

    constructor(databaseHandler:IDatabaseHandler){
        this.databaseHandler = databaseHandler;
    }
    /**
     * Compares the userID of the request with the userID fetched from Microsoft Graph in order to confirm identity
     * @param userID
     * @param authToken Microsoft Graph access token
     * @returns Returns true if the userIDs are a match
     */
    async authenticate(userID: string, authToken?: string): Promise<boolean> {
        let returnVal:boolean = false;

        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/',  {json: true }, (err, res, body) => {
                if(!body){
                    reject(returnVal);
                }
                
                if(userID == body.id){
                    returnVal = true;
                }else{
                    returnVal = false;
                }

                if(err){
                    reject(console.log(err));
                }
                resolve(returnVal);
                
            }).auth(null,null,true,authToken);
        }).then(() => {
            return returnVal;
        }).catch(()=>{return new Promise((resolve)=>{resolve(false)})});  
    }


    authorize(userID: string, action: Actions): boolean {
        throw new Error("Method not implemented.");
    }


}