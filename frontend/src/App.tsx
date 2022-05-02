import React, { Component } from 'react';
import logo from './logo.svg';
import heimdalLogo from './nordiske-guder-heimdal.jpg'
import './App.css';
import {config} from './config.js';
import {PublicClientApplication} from '@azure/msal-browser';
import { resolve } from 'path';
import { rejects } from 'assert';
import UserBox from './components/UserBox';
import { ClientHandler } from './common/ClientHandler';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  graph = require('@microsoft/microsoft-graph-client');
  clientHandler = new ClientHandler;

  constructor(props:any){
    super(props)
    this.state = {
      error:null,
      isAuthenticated:false,
      user:{}
    };

    //this.login = this.login.bind(this)
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
      <div className="Wrapper" style={{}}>
        {this.state.isAuthenticated ? 
          <div className='App'>
            <div id="sidebar" style={{backgroundColor:"grey",width:"20%",height:"99.5vh",display:"inline-block",alignContent:"center"}}> 
              <UserBox isLoggedIn={this.state.isAuthenticated} clientHandler={this.clientHandler}/>
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
