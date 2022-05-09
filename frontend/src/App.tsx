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
import { PreferencesView } from './components/PreferencesView';

class App extends React.Component<{},{error:any,isAuthenticated:boolean,user:any}> {
  
  graph = require('@microsoft/microsoft-graph-client');
  clientHandler = new ClientHandler;
  backendAPI = new BackendAPI(this.clientHandler);
  currentView:number;
  viewsArray:any[];

  constructor(props:any){
    super(props)
    this.state = {
      error:null,
      //CHANGE TO FALSE ON PRODUCTION!
      isAuthenticated:true,
      user:{}
    };
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.viewsArray = []
    this.currentView = 0;
    //Inserts the views into the view array. Buttons change between these views!
    this.viewsArray.push(<LogView backendAPI={this.backendAPI}></LogView>)
    this.viewsArray.push(<PreferencesView></PreferencesView>)
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
      alert('The user could not be authenticated \n Please try again');
    }
  }

  async logout(){
    if(await this.clientHandler.logout()){
      this.setState({isAuthenticated:false})
    }else{
      console.log("Sign Out failed");
      
    }
  }

  changeView(view:number){
    if(view != this.currentView){
      this.currentView = view;
      this.forceUpdate();
    }
  }

  render(){
    return (
      <div className="Wrapper">
        {this.state.isAuthenticated ? 
          <div className='App' style={{display:'flex'}}>
            <div className="Sidebar">
              <img src={heimdalLogo} style={{width:"95%",height:"auto"}}></img> 
              <UserBox isLoggedIn={this.state.isAuthenticated} clientHandler={this.clientHandler} logout={this.logout}/>
              <nav style={{display:"flex",flexDirection:"column", width:"100%"}}>
                <button className='Nav-button' onClick={()=>{this.changeView(0)}}>View Logs</button>
                <button className='Nav-button' onClick={()=>{this.changeView(1)}}>Preferences</button>
              </nav>
            </div>
            <div id='MainView' style={{backgroundColor:"gray",width:"80%",height:"100vh",boxShadow:"inset 0 0 10px 0px",display:"flex",justifyContent:"center"}}>
              {this.viewsArray[this.currentView]}
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
}

export default App;
