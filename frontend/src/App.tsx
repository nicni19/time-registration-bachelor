import React, { Component } from 'react';
import logo from './logo.svg';
import heimdalLogo from './nordiske-guder-heimdal.jpg'
import './App.css';
import {config} from './config.js';
import {PublicClientApplication} from '@azure/msal-browser';
import { resolve } from 'path';
import { rejects } from 'assert';
import UserBox from './components/UserBox';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  publicClientApplication:PublicClientApplication;
  graph = require('@microsoft/microsoft-graph-client');
  globalID = "";

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

  //Ikke rigtigt brugbar længere, brug i stedet accountID fra login-metoden
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
      const loginRequest = {scopes: config.scopes}
      let accountId = "";

      this.publicClientApplication.loginPopup(loginRequest)
      .then(function (loginResponse:any) {
          accountId = loginResponse.account.homeAccountId;
          // Display signed-in user content, call API, etc.
      }).then(async()=>{
          //TODO: Find en pænere måde 
          let idArray = accountId.split("-");
          accountId = idArray[3] + idArray[4];
          accountId = accountId.split(".")[0];
          console.log("New id: " + accountId);
          this.globalID = accountId;
          
          if(await this.backendDoesUserExsist(accountId)){
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
    this.publicClientApplication.logoutPopup();
    this.setState({isAuthenticated:false})
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
      <div className="Wrapper" style={{}}>
        {this.state.isAuthenticated ? 
          <div className='App'>
            <div id="sidebar" style={{backgroundColor:"grey",width:"20%",height:"99.5vh",display:"inline-block",alignContent:"center"}}> 
              <UserBox isLoggedIn={this.state.isAuthenticated}/>
              {this.state.isAuthenticated ? <p><button onClick={()=>{this.logout()}}>Log out</button></p> :<button onClick={()=>{this.login()}}>Click here to login like a true Jondog!</button>}
            </div>
            <div id='MainView' style={{backgroundColor:"lightgray",width:"80%",height:"99.5vh",display:"inline-block",boxShadow:"inset 0 0 10px 0px"}}>
              
            </div>
          </div>
          :
          <header className='App-header'>
              <img src={heimdalLogo} className="App-logo" alt="logo" />
              <h1>Heimdal</h1>
              <h2>Time Registration System</h2>
              <button onClick={()=>{this.login()}}>Click here to login like a true Jondog!</button>
          </header>
        }
        
      </div>
    );
  }

  /*
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
              <button onClick={()=>{this.backendDoesUserExsist(this.globalID)}}>testQuery</button>
              <button onClick={async()=>{this.getGraphUserID(await this.getSilentAccessToken())}}>Returnval</button>
              <button onClick={()=>{this.logout()}}>Log out</button>
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
  */
}

export default App;
