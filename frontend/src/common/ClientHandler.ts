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

    /**
     * Uses the publicClientApplication object from the MSAL library to display a login pop-up to the user.
     * If authenticated successfully, the users Graph ID is fetched which is then used to authenticate the user towards the backend service.
     * @returns A boolean value signaling whether or not the user was successfully authenticated.
     */
    async login():Promise<boolean>{
      const loginRequest = {scopes: config.scopes}
      let accountId = "";
      
      return new Promise((resolve,reject)=>{
        this.publicClientApplication.loginPopup(loginRequest)
        .then(function (loginResponse:any) {
            accountId = loginResponse.account.homeAccountId;
            // Display signed-in user content, call API, etc.
        }).then(async()=>{
            //The Graph relevant ID is extracted from the "homeAccountID" as the Graph ID is a subset of the AccountID
            let idArray = accountId.split("-");
            accountId = idArray[3] + idArray[4];
            accountId = accountId.split(".")[0];
            this.globalID = accountId;
            
            if(await this.backendDoesUserExsist(accountId)){
              resolve(true)     
            }else{
              resolve(false)
            }              
        }).catch(function (error) { 
            //login failure
            alert('An error occured during login \n Error: ' + error);
            reject()
            
        });
      })
      
    }

    getUserId():string{
      return this.globalID;
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

    /**
     * Authenticates the user towards the backend system based on the user ID.
     * @param userId The users ID / Microsoft Graph ID
     * @returns If true, a user with the corresponding ID exsists in the system database
     */
    async backendDoesUserExsist(userId:string):Promise<JSON>{
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

    /**
     * Uses the publicClientApplication object of the MSAL library to get an access token based on the defined scope (privilages) in the
     * config file.
     * @returns A Microsoft Graph access token
     */
    async getSilentAccessToken():Promise<string>{
        return await new Promise(async(resolve,reject)=>{
          let accessToken = "";
          let account = this.publicClientApplication.getAllAccounts()[0];
          this.publicClientApplication.acquireTokenSilent({scopes:config.scopes,account}).then((accessTokenResponse)=>{
            accessToken = accessTokenResponse.accessToken;
            resolve(accessToken)
          }).then(()=>{return accessToken}).catch((error)=>{console.log(error)})
        });
    }

    async getNameAndEmail():Promise<string[]>{
      let returnArray:string[] = [];

      return await new Promise(async(resolve,reject) =>{    
          await fetch('https://graph.microsoft.com/v1.0/me',{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + await this.getSilentAccessToken()
          }
        }).then(response => response.json()).then(data=>{
          returnArray[0] = data.givenName;
          returnArray[1] = data.surname;
          returnArray[2] = data.userPrincipalName;
          resolve(returnArray)
        })})
    }
    
    async getAccountPhoto():Promise<string>{
      let returnval:any;
      return await new Promise(async(resolve,reject) =>{
        console.log("AccessToken (Graph): " + this.globalID)      
        returnval = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value',{
          method: 'GET',
          headers: {
              'Content-Type': 'image/jpeg',
              'Authorization': 'Bearer ' + await this.getSilentAccessToken()
          }
        }).then(response => response.blob()).then(data=>{
          if(data.size > 1000){
            resolve(URL.createObjectURL(data))
          }else{
            reject()
          }
        }).catch((err)=>{
            reject()
        });
      });
    }

    //Legacy code. No longer in use.
    async getGraphUserID(accessToken:string):Promise<string>{
      let id:string = "";
      let returnval:any;
      let responseJson:any = {};
      return await new Promise(async(resolve,reject) =>{
        console.log("AccessToken (Graph): " + accessToken)      
        returnval = await fetch('https://graph.microsoft.com/v1.0/me',{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken
          }
          
        }).then(response => response.json()).then(data=>{responseJson = data;}).then(()=>{console.log(responseJson.id);return responseJson.id})
        
      }).then(()=>{return id});
    }

}