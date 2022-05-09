import { resolve } from "path";
import { ClientHandler } from "./ClientHandler";
import { LogElement } from "../common/LogElement";

export class BackendAPI{

  clientHandler:ClientHandler;

  constructor(clientHandler:ClientHandler){
    this.clientHandler = clientHandler;
  }

  async getLogElements(startStamp:string,endStamp:string):Promise<JSON>{
    let token = await this.clientHandler.getSilentAccessToken();
    let userId = this.clientHandler.getUserId();

    console.log(startStamp)

    return new Promise<JSON>(async (resolve,reject)=>{
      await fetch('http://localhost:3000/getLogElements/' + startStamp + 'T00:00:00.0000000' + '/' + endStamp + 'T00:00:00.0000000',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userid' : userId
        },
        //body: JSON.stringify(data),
        mode: 'cors'
      }).then(response => response.json()).then(data=>{
        console.log(data)
        resolve(data)
      }).catch((err)=>{
        alert('Could not fetch elements from backend \n Error: ' + err)
      });
  })
  }

  async insertLogElements(logElements: LogElement[]):Promise<JSON>{
    let token = await this.clientHandler.getSilentAccessToken();
    let userId = this.clientHandler.getUserId();
    console.log("Backend", logElements);
    
    

    return new Promise<JSON>(async (resolve,reject)=>{
      await fetch('http://localhost:3000/insertLogElements',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userid' : userId
        },
        body: JSON.stringify({
          'logElements': logElements,
        }),
        mode: 'cors'
      }).then(response => response.json()).then(data=>{
        alert(data.message)
        resolve(data)
      }).catch((err)=>{
        alert(err)
      });
  })
  }

  async deleteLogElements(ids: number[]):Promise<JSON>{
    let token = await this.clientHandler.getSilentAccessToken();
    let userId = this.clientHandler.getUserId();

    return new Promise<JSON>(async (resolve,reject)=>{
      await fetch('http://localhost:3000/deleteLogElements',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userid' : userId
        },
        body: JSON.stringify({
          'ids': ids,
        }),
        mode: 'cors'
      }).then(response => response.json()).then(data=>{
        resolve(data)
      }).catch((err)=>{
        alert(err)
      });
  })
  }
}