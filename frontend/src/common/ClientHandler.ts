import {PublicClientApplication} from '@azure/msal-browser';
import {config} from '../config.js';

export class ClientHandler{
    publicClientApplication:PublicClientApplication;
    globalID = "";

    constructor(){
        this.publicClientApplication = new PublicClientApplication({
            auth:{
              clientId: config.appId,
              redirectUri: config.redirectUri,
              authority: config.authority
            },
            cache:{
              cacheLocation:"sessionStorage",
              storeAuthStateInCookie: true
            }
          });
    }

    async login():Promise<boolean>{
      const loginRequest = {scopes: config.scopes}
      let accountId = "";
      
      return new Promise((resolve,reject)=>{
        this.publicClientApplication.loginPopup(loginRequest)
        .then(function (loginResponse:any) {
            accountId = loginResponse.account.homeAccountId;
            // Display signed-in user content, call API, etc.
        }).then(async()=>{
            //TODO: Find en pænere måde 
            let idArray = accountId.split("-");
            accountId = idArray[3] + idArray[4];
            accountId = accountId.split(".")[0];
            //console.log("New id: " + accountId);
            this.globalID = accountId;
            
            if(await this.backendDoesUserExsist(accountId)){
              resolve(true)     
            }else{
              resolve(false)
            }              
        }).catch(function (error) { 
            //login failure
            console.log(error);
        });
      })
      
    }

    async logout():Promise<boolean>{
        return new Promise((resolve,reject)=>{
          this.publicClientApplication.logoutPopup().then(()=>{resolve(true)})
          .catch((err)=>{
            console.log(err)
            resolve(false)
          })
        });
      }

    async backendDoesUserExsist(userId:string){
        let token = await this.getSilentAccessToken();
        return await fetch('http://localhost:3000/doesCurrentUserExist',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'userid' : userId
            },
            mode: 'cors'
        }).then(response => response.json()).then(data=>{return data.userFound})
      }

      async getSilentAccessToken():Promise<string>{
        return await new Promise(async(resolve,reject)=>{
          let accessToken = "";
          let account = this.publicClientApplication.getAllAccounts()[0];
          this.publicClientApplication.acquireTokenSilent({scopes:config.scopes,account}).then((accessTokenResponse)=>{
            accessToken = accessTokenResponse.accessToken;
            //console.log("Access Token: " + accessToken);
            resolve(accessToken)
          }).then(()=>{return accessToken}).catch((error)=>{console.log(error)})
        });
      }

}