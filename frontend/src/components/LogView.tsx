import React from "react";
import { BackendAPI } from "../common/BackendAPI";

type LogViewProps = {
  backendAPI:BackendAPI;
}

export class LogView extends React.Component<LogViewProps>{

  constructor(props:any){
    super(props)
    
  }

  render(){
    return(
      <div id="outerView" className="Outer-view" style={{width:"90%",height:"90vh",marginTop:"5vh",backgroundColor:"pink"}}>
        <p>(DATE PICKER)</p>
        <div id="elementView" style={{width:"100%",height:"80%",backgroundColor:"blue"}}>
        
        </div>
        <button onClick={()=>{this.props.backendAPI.getLogElements()}} style={{width:"100%",height:"5vh",backgroundColor:"green",marginTop:"0.5vh"}}>Submit changes to database</button>
      </div>
    )
  }
}