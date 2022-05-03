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
      <div id="outerView" className="Outer-view">
        <p style={{height:"4vh"}}>(DATE PICKER)</p>
        <div className="Field-identifier">
          <p className="Identifier-generic" style={{width:"29%",borderRightWidth:"0.1vh"}}>Description</p>
          <p className="Identifier-generic" style={{width:"6%",borderRightWidth:"0.1vh"}}>Start time</p>
          <p className="Identifier-generic" style={{width:"10%",borderRightWidth:"0.1vh"}}>Type</p>
          <p className="Identifier-generic" style={{width:"3.5%",borderRightWidth:"0.1vh"}}>Dur.</p>
          <p className="Identifier-generic" style={{width:"15%",borderRightWidth:"0.1vh"}}>Customer</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh"}}>Rit num</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh"}}>Case num</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh",marginRight:"0.3vw"}}>Case task</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh"}}>Internal</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh",marginLeft:"-0.2vw"}}>Unpaid</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh",marginLeft:"-0.2vw"}}>Ready</p>
        </div>
        <div ref={this.elementViewRef} id="elementView" className="Element-view">
          {
            this.globalLogElements
          }
        </div>
        <button className="Commit-button" onClick={async()=>{this.fetchLogElements()}}>Submit changes to database</button>
      </div>
    )
  }
}