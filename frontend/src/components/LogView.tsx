import React from "react";
import { BackendAPI } from "../common/BackendAPI";
import { LogElement } from "../common/LogElement";
import { LogElementComponent } from "./LogElementComponent";
import './stylesheets/LogView.css'

type LogViewProps = {
  backendAPI:BackendAPI;
}

export class LogView extends React.Component<LogViewProps>{

  elementViewRef:any;
  globalLogElements:any[];

  constructor(props:any){
    super(props)

    this.elementViewRef = React.createRef();
    this.globalLogElements = []
  }

  async fetchLogElements(){

    this.globalLogElements = []
    this.forceUpdate();

    let elements:any = await this.props.backendAPI.getLogElements();
    //console.log(await elements);
    if(elements){
      for(let i = 0; i < elements.logElements.length; i++){

        let current = elements.logElements[i];
        let logElement = new LogElement(current.userID,current.type,current.description,current.startTimestamp,current.duration,current.internalTask,current.unpaid,current.ritNum,current.caseNum,current.caseTaskNum,current.customer,current.edited,current.bookKeepReady,current.calendarid,current.mailid,current.id);

        this.globalLogElements.push(<LogElementComponent logElement={logElement}></LogElementComponent>);
      }

      this.forceUpdate();
    }

  }

  render(){
    return(
      <div id="outerView" className="Outer-view" style={{width:"90%",height:"90vh",marginTop:"5vh",backgroundColor:"lightgray"}}>
        <p>(DATE PICKER)</p>
        <div ref={this.elementViewRef} id="elementView" className="Element-view">
          {
            this.globalLogElements
          }
        </div>
        <button onClick={async()=>{this.fetchLogElements()}} style={{width:"100%",height:"5vh",backgroundColor:"green",marginTop:"0.5vh"}}>Submit changes to database</button>
      </div>
    )
  }
}