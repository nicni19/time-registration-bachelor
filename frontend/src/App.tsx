import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {config} from './config.js';
import {PublicClientApplication} from '@azure/msal-browser';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  publicClientApplication:PublicClientApplication;

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

  async login(){
    try{
      //Popup
      await this.publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      })
      this.setState({isAuthenticated:true})
    }
    catch(err){
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

  test(){
    let account = this.publicClientApplication.getAllAccounts()[0];
    this.publicClientApplication.acquireTokenSilent({scopes:['user.read'],account}).then((accessTokenResponse)=>{
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
