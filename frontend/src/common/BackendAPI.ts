import { resolve } from "path";
import { ClientHandler } from "./ClientHandler";

export class BackendAPI{

  clientHandler:ClientHandler;

  constructor(clientHandler:ClientHandler){
    this.clientHandler = clientHandler;
  }

  async getLogElements():Promise<JSON>{
    let token = await this.clientHandler.getSilentAccessToken();
    let userId = this.clientHandler.getUserId();

    return new Promise<JSON>(async (resolve,reject)=>{
      await fetch('http://localhost:3000/getLogElements',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userid' : userId
        },
        //body: JSON.stringify(data),
        mode: 'cors'
      }).then(response => response.json()).then(data=>{
        resolve(data)
      });
  })
  }
}