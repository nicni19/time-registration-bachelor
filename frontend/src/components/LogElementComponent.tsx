import React from "react";
import { LogElement } from "../common/LogElement";
import './stylesheets/LogElementComponent.css'

type LogElementComponentProps = {
  logElement:LogElement;
}

export class LogElementComponent extends React.Component<LogElementComponentProps>{

  descriptionRef:any

  constructor(props:any){
    super(props)
    this.descriptionRef = React.createRef()
  }

  render(){
    return(
      <div id="elementShell" className="Element-shell">
        <div className="Indicator" style={{width:"1%",height:"100%",backgroundColor:"green"}}></div>
        <div contentEditable="true" style={{backgroundColor:"white",height:"90%",width:"10%",alignSelf:"flex-start",marginTop:""}}>Helllo!</div>
      </div>
    )
  }
}