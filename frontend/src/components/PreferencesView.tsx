import React from "react";
import { BackendAPI } from "../common/BackendAPI";

type PreferencesViewProps = {
  backendAPI:BackendAPI;
}

export class PreferencesView extends React.Component<PreferencesViewProps,{mail_enabled:boolean,calendar_enabled:boolean,isLoading:boolean}>{

  mailEnabledRef:any;
  calendarEnabledRef:any;

  constructor(props:any){
    super(props)

    this.state = {
      mail_enabled:false,
      calendar_enabled:false,
      isLoading:false
    }

    this.mailEnabledRef = React.createRef()
    this.calendarEnabledRef = React.createRef()
  }

  async componentDidMount(){
    /*
    let preferences:any = await this.getPreferences();
    if(await preferences){
      console.log(preferences[0],preferences[1])
      this.mailEnabledRef.current.checked = preferences[0]
      this.setState({mail_enabled:preferences[0],calendar_enabled:preferences[1],isLoading:false})
    
    }
    */
    console.log(await this.getPreferences())
  }

  async getPreferences():Promise<boolean[]>{
    return new Promise(async(resolve,reject)=>{
      let returnArray = []
      let preferences:any = await this.props.backendAPI.getPreferences();
      if(await preferences){
        returnArray.push(preferences.preferences[0].mail_enabled);
        returnArray.push(preferences.preferences[1].calendar_enabled);
        
        this.setState({mail_enabled:preferences.preferences[0].mail_enabled,calendar_enabled:preferences.preferences[1].calendar_enabled})
      }
      resolve(returnArray)
    })
  }

  updatePreferences(){
    console.log(this.state.mail_enabled)
    this.props.backendAPI.updatePreferences([this.state.mail_enabled,this.state.calendar_enabled])
  }
  

  render(){
    return(
      <div>
        {this.state.isLoading ?
        <div>
          <p>Loading..</p>
        </div>
        :
        <div>
          <h1 style={{marginTop:"20%"}}>User preferences</h1>
          <p style={{marginBottom:"10vh"}}>Select which Graph elements you wish for Heimdal to include in your log</p>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",width:"40%"}}>
              <p style={{marginTop:"-2%",fontSize:"x-large",fontFamily:"Roboto', sans-serif"}}>Mail elements</p>
              <p style={{marginTop:"-2%",fontSize:"x-large",fontFamily:"Roboto', sans-serif"}}>Calendar elements</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",width:"40%"}}>
              <input ref={this.mailEnabledRef} id="mailCheckbox" type="checkbox" style={{transform:"scale(4)",marginRight:"2vw",marginTop:"5%"}} defaultChecked={false} onChange={()=>{this.setState({mail_enabled:(!this.state.mail_enabled)})}}></input>
              <input ref={this.calendarEnabledRef} id="calendarCheckbox" type="checkbox" style={{transform:"scale(4)",marginRight:"2vw",marginTop:"20%"}} defaultChecked={false} onChange={()=>{this.setState({calendar_enabled:(!this.state.calendar_enabled)})}}></input>
            </div>
          </div>
          <button id="Update-preferences-button" onClick={()=>{this.updatePreferences()}}>Update preferences</button>
        </div>
        }
        
      </div>
    )
  }
}