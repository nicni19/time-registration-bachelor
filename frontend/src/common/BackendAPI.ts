import { ClientHandler } from "./ClientHandler";

export class BackendAPI{

  clientHandler:ClientHandler;

  constructor(clientHandler:ClientHandler){
    this.clientHandler = clientHandler;
  }

  async getLogElements(){
    let responseJson = {};
    await fetch('http://localhost:3000/GetLogElements',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await this.clientHandler.getSilentAccessToken(),
            'userid' : this.clientHandler.getUserId()
        },
        //body: JSON.stringify(data),
        mode: 'cors'
    }).then(response => response.json()).then(data=>{
      
      for(let i = 0; i < data.length; i++){
        console.log(data[i])
      }

    });

  }
}