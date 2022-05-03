import React from "react";
import { LogElement } from "../common/LogElement";
import './stylesheets/LogElementComponent.css'

type LogElementComponentProps = {
  logElement:LogElement;
}

export class LogElementComponent extends React.Component<LogElementComponentProps>{

  descriptionRef:any
  startTimestampRef:any
  typeRef:any
  durationRef:any
  customerRef:any
  ritNumRef:any
  caseNumRef:any
  caseTaskNumRef:any
  internalRef:any
  unpaidRef:any
  bookKeepReadyRef:any

  constructor(props:any){
    super(props)
    this.descriptionRef = React.createRef()
    this.startTimestampRef = React.createRef()
    this.typeRef = React.createRef()
    this.durationRef = React.createRef()
    this.customerRef = React.createRef()
    this.ritNumRef = React.createRef()
    this.caseNumRef = React.createRef()
    this.caseTaskNumRef = React.createRef()
    this.internalRef = React.createRef()
    this.unpaidRef = React.createRef()
    this.bookKeepReadyRef = React.createRef()
  }

  convertStartTimestamp():string{
    let date = new Date(this.props.logElement.getStartTimestamp())
    return date.toDateString();
  }

  render(){
    return(
        <div id="elementShell" className="Element-shell">
          <div className="Indicator" style={{width:"1%",height:"100%",backgroundColor:"green"}}></div>
          <div ref={this.descriptionRef} className="Log-element-generic" contentEditable="true" style={{width:"28%"}}>{this.props.logElement.getDescription()}</div>
          <div ref={this.startTimestampRef} className="Log-element-generic" style={{width:"6%"}}>{this.convertStartTimestamp()}</div>
          <div ref={this.typeRef} className="Log-element-generic" style={{width:"10%"}}>{this.props.logElement.getType()}</div>
          <div ref={this.durationRef} className="Log-element-generic" contentEditable="true" style={{width:"3%"}}>{this.props.logElement.getDuration()}</div>
          <div ref={this.customerRef} className="Log-element-generic" contentEditable="true" style={{width:"15%"}}>{this.props.logElement.getCustomer()}</div>
          <div ref={this.ritNumRef} className="Log-element-generic" style={{width:"5%"}}>{this.props.logElement.getRitNum()}</div>
          <div ref={this.caseNumRef} className="Log-element-generic" style={{width:"5%"}}>{this.props.logElement.getCaseNum()}</div>
          <div ref={this.caseTaskNumRef} className="Log-element-generic" style={{width:"5%"}}>{this.props.logElement.getCaseTaskNum()}</div>
          <input ref={this.internalRef} className="Log-element-checkbox" type="checkbox" defaultChecked={this.props.logElement.getInternalTask()}></input>
          <input ref={this.unpaidRef} className="Log-element-checkbox" type="checkbox" defaultChecked={this.props.logElement.getUnpaid()}></input>
          <input ref={this.bookKeepReadyRef} className="Log-element-checkbox" type="checkbox" defaultChecked={this.props.logElement.getBookKeepReady()}></input>
          <button className="Delete-button">|_|</button>
        </div>
    )
  }
}