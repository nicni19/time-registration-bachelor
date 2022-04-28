import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {config} from './config.js';
import {PublicClientApplication} from '@azure/msal-browser';
import { resolve } from 'path';
import { rejects } from 'assert';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  publicClientApplication:PublicClientApplication;
  graph = require('@microsoft/microsoft-graph-client');

  constructor(props:any){
    super(props)
    this.state = {
      error:null,
      isAuthenticated:false,
      user:{}
    };

    this.login = this.login.bind(this)
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
  
  async login(){
    try{
      /*
      //Popup
      await this.publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      })
      let graphID = await this.getGraphUserID(await this.getSilentAccessToken()).then(()=>{
        if(graphID != undefined){
          console.log("Yes")
          this.setState({isAuthenticated:true})
        }else{
          console.log("No")
        }
      })     
      */
      //this.setState({isAuthenticated:true})

      const loginRequest = {
        scopes: ["user.read"]
      }

      let accountId = "";

      this.publicClientApplication.loginPopup(loginRequest)
      .then(function (loginResponse:any) {
          accountId = loginResponse.account.homeAccountId;
          // Display signed-in user content, call API, etc.
      }).then(async()=>{
          accountId = accountId.replace(/[-0]/g, "")
          accountId = accountId.split(".")[0];
          console.log(accountId);
          if(this.publicClientApplication.getAllAccounts()[0] != null){
            this.setState({isAuthenticated:true})      
          }    

      }).catch(function (error) { 
          //login failure
          console.log(error);
      });

    }
    catch(err){
      console.log(err)
      this.setState({
        isAuthenticated:false,
        user:{},
        error:err
      })
    }
  }

  logout(){
    //this.publicClientApplication.logoutPopup;
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

  async test(){
    //console.log(await this.getGraphUserID)
    let account = this.publicClientApplication.getAllAccounts()[0];
    this.publicClientApplication.acquireTokenSilent({scopes:config.scopes,account}).then((accessTokenResponse)=>{
      let accessToken = accessTokenResponse.accessToken;
      console.log("Access Token: " + accessToken);
    }).catch((error)=>{console.log(error)})
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          {this.state.isAuthenticated ? 
            <p>
              Login successfull
              <button onClick={()=>{this.test()}}>Show token</button>
              <button onClick={async()=>{this.getGraphUserID(await this.getSilentAccessToken())}}>Returnval</button>
            </p>
            :
            <p>
              <button onClick={()=>{this.login()}}>Click here to login like a true Jondog!</button>
            </p>
          }
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jondogs click here
          </a>
        </header>
      </div>
    );
  }
}

export default App;
