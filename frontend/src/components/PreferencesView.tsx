import React from "react";

export class PreferencesView extends React.Component{
  constructor(props:any){
    super(props)
  }

  render(){
    return(
      <div>
        <h1 style={{marginTop:"20%"}}>User preferences</h1>
        <p style={{marginBottom:"10vh"}}>Select which Graph elements you wish for Heimdal to include in your log</p>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",width:"40%"}}>
            <p style={{marginTop:"-2%",fontSize:"x-large",fontFamily:"Roboto', sans-serif"}}>Mail</p>
            <p style={{marginTop:"-2%",fontSize:"x-large",fontFamily:"Roboto', sans-serif"}}>Calendar</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",width:"40%"}}>
            <input id="mailCheckbox" type="checkbox" style={{transform:"scale(4)",marginRight:"2vw",marginTop:"5%"}}></input>
            <input id="calendarCheckbox" type="checkbox" style={{transform:"scale(4)",marginRight:"2vw",marginTop:"20%"}}></input>
          </div>
        </div>
        <button style={{width:"75%",height:"5vh",backgroundColor:"#73b36b",marginTop:"5vh",borderColor:"transparent",fontFamily:"Roboto', sans-serif",fontSize:"large"}}>Save choice</button>
        
      </div>
    )
  }

  /*
  <div>
            <input id="mailCheckbox" type="checkbox" style={{transform:"scale(2)",marginRight:"2vw"}}></input>
            <label htmlFor="mailCheckbox" style={{fontSize:"large", fontFamily:"'Roboto', sans-serif"}}>Mail elements</label>
          </div>

          <div>
            <input id="calendarCheckbox" type="checkbox" style={{transform:"scale(2)",marginRight:"2vw"}}></input>
            <label htmlFor="calendarCheckbox" style={{fontSize:"large", fontFamily:"'Roboto', sans-serif"}}>Calendar elements</label>
          </div>
*/
}