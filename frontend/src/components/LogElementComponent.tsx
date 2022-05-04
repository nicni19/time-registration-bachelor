import React from "react";
import { LogElement } from "../common/LogElement";
import './stylesheets/LogElementComponent.css'

type LogElementComponentProps = {
  logElement:LogElement;
  index:number;
  markElementForDeletion:Function
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
    this.updateLogElementState = this.updateLogElementState.bind(this)
    //this.forceUpdate()
  }


  componentDidMount(){
    this.setState({checkBoxValue:true})
    
  }

  //TODO: Check on indhold fra div'erne er null, undefined, whatever. Måske relevant på nogle af dem?
  updateLogElementState(){
    if(this.descriptionRef.innerHTML != this.props.logElement.getDescription()){this.props.logElement.setDescription("" + this.descriptionRef.current.innerHTML)}
    if(this.durationRef.innerHTML != this.props.logElement.getDuration() && typeof this.durationRef.innerHTML == 'number'){this.props.logElement.setDuration(this.durationRef.innerHTML)}
  }

  convertStartTimestamp():string{
    if(this.props.logElement.getStartTimestamp() != 0){
      let date = new Date(this.props.logElement.getStartTimestamp() * 1000)
      let finalDate:string = date.getDay() + " | " + date.getMonth() + " | " + date.getFullYear()
      return finalDate;
    }else{
      return "";
    }
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
            <div ref={this.ritNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getRitNum()}</div>
            <div ref={this.caseNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseNum()}</div>
            <div ref={this.caseTaskNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseTaskNum()}</div>
            <input ref={this.internalRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getInternalTask()} onClick={()=>{this.props.logElement.setInternalTask(!this.props.logElement.getInternalTask()); this.forceUpdate()}}></input>
            <input ref={this.unpaidRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getUnpaid()} onClick={()=>{this.props.logElement.setUnpaid(!this.props.logElement.getUnpaid()); this.forceUpdate()}}></input>
            <input ref={this.bookKeepReadyRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getBookKeepReady()} onClick={()=>{this.props.logElement.setBookKeepReady(!this.props.logElement.getBookKeepReady()); this.forceUpdate()}}></input>
            <button className="Delete-button" onClick={()=>{this.props.markElementForDeletion(this.props.index)}}>|_|</button>
          </div>
    )
  }
}