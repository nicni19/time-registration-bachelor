import { Actions } from "./domain/Actions";
import { IAuthHandler } from "./interfaces/IAuthHandler";
import express from 'express';
const request = require('request');

export class MicrosoftAuthHandler implements IAuthHandler{
    
    async authenticate(userID: string, authToken?: string): Promise<boolean> {
        
        console.log(this.authenticateElectricBoogaloo(userID,authToken));
        return false;
        
    }

    async authenticateElectricBoogaloo(userID: string, authToken?: string){
        return await new Promise((resolve,reject) => {
            request.get('https://graph.microsoft.com/v1.0/me/',  {json: true }, (err, res, body) => {
                if(userID == body.id){
                    resolve(true);
                }else{
                    reject(false);
                }
            }).auth(null,null,true,authToken);
        })
    }



    authorize(userID: string, action: Actions): boolean {
        throw new Error("Method not implemented.");
    }


}