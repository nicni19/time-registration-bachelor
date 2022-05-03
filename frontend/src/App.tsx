import React, { Component } from 'react';
import logo from './logo.svg';
import heimdalLogo from './public/Heimdal_logo.png'
import './App.css';
import {config} from './config.js';
import {PublicClientApplication} from '@azure/msal-browser';
import { resolve } from 'path';
import { rejects } from 'assert';
import UserBox from './components/UserBox';
import { ClientHandler } from './common/ClientHandler';
import relateITLogo from './public/RelateIT_logo_big.svg';
import msLoginLogo from './public/ms_sign_in_light.svg'
import { LogView } from './components/LogView';
import { BackendAPI } from './common/BackendAPI';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  graph = require('@microsoft/microsoft-graph-client');
  clientHandler = new ClientHandler;
  backendAPI = new BackendAPI(this.clientHandler);

  constructor(props:any){
    super(props)
    this.state = {
      error:null,
      isAuthenticated:false,
      user:{}
    };
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
  }
  
  async login(){
    let loginResult = await this.clientHandler.login();
    if(loginResult){
      this.setState({isAuthenticated:true}); 
    }else{
      console.log(loginResult)
      this.setState({
        isAuthenticated:false,
        user:{}
      })
    }
  }

  async logout(){
    if(await this.clientHandler.logout()){
      this.setState({isAuthenticated:false})
    }else{
      console.log("Sign Out failed");
      
    }
  }

  render(){
    return (
      <div className="Wrapper">
        {this.state.isAuthenticated ? 
          <div className='App' style={{display:'flex'}}>
            <div id="sidebar" style={{backgroundColor:"#282c34",width:"20%",height:"100vh",alignContent:"center"}}>
              <img src={heimdalLogo} style={{width:"95%",height:"auto"}}></img> 
              <UserBox isLoggedIn={this.state.isAuthenticated} clientHandler={this.clientHandler} logout={this.logout}/>
              <nav style={{display:"flex",flexDirection:"column", width:"100%"}}>
                <button className='Nav-button'>Test</button>
                <button className='Nav-button'>Test</button>
                <button className='Nav-button'>Test</button>
                <button className='Nav-button'>Test</button>
              </nav>
            </div>
            <div id='MainView' style={{backgroundColor:"gray",width:"80%",height:"100vh",boxShadow:"inset 0 0 10px 0px",display:"flex",justifyContent:"center"}}>
              <LogView backendAPI={this.backendAPI}></LogView> 
            </div>
          </div>
          :
          <header className='App-header'>
              <img src={heimdalLogo} className="Heimdal-logo" alt="logo" style={{width:"50vw",marginBottom:"2vw"}}/>
              <img src={relateITLogo} alt="logo" style={{width:"25vw"}}/>
              
              <button onClick={()=>{this.login()}} style={{border:"0",background:"transparent",marginTop:"6vw"}}>
                  <img src={msLoginLogo}></img>
              </button>
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
