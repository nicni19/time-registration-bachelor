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
  /*
  async getGraphUserID(accessToken:string):Promise<string>{
    let id:string = "";
    return await new Promise((resolve,reject) =>{
      request.get('https://graph.microsoft.com/v1.0/me',{ json: true },(err: any,res: any,body: any)=>{
        if(err){
          console.log(err)
          return null;
        }
        id = body.id;
        resolve(id)
      }).auth(null,null,true,accessToken);
    }).then(()=>{return id});
  }
  */
  async login(){
    try{
      //Popup
      await this.publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      })
      /*
      .then(()=>{
        let account = this.publicClientApplication.getAllAccounts()[0];
        let accessToken:string;
        this.publicClientApplication.acquireTokenSilent({scopes:config.scopes,account}).then((accessTokenResponse)=>{
          accessToken = accessTokenResponse.accessToken;
        }).then(async()=>{
          await this.getGraphUserID(accessToken)
        });
        
      })
      */
      this.setState({isAuthenticated:true})
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

  async test(){
    //console.log(await this.getGraphUserID)
    let account = this.publicClientApplication.getAllAccounts()[0];
    this.publicClientApplication.acquireTokenSilent({scopes:config.scopes,account}).then((accessTokenResponse)=>{
      let accessToken = accessTokenResponse.accessToken;
      console.log(accessToken);
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
