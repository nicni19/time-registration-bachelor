import React from "react";
import { LogElement } from "../common/LogElement";
import './stylesheets/LogElementComponent.css'
import trashcan from '../public/trashcan.png'
import { Type } from "../common/Type";

type LogElementComponentProps = {
  logElement:LogElement;
  index:number;
  markElementForDeletion:Function;
  updateSpecificComponent:Function;
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

  componentDidUpdate(prevProps:any){
    if(prevProps.logElement != this.props.logElement){
      this.setState({logElement:this.props.logElement})
    }
  }

  //TODO: Check on indhold fra div'erne er null, undefined, whatever. Måske relevant på nogle af dem?
  updateLogElementState(){
    if(this.descriptionRef.current.innerHTML != this.props.logElement.getDescription()){this.props.logElement.setDescription("" + this.descriptionRef.current.innerHTML)}
    if(this.durationRef.current.innerHTML != this.props.logElement.getDuration() && typeof this.durationRef.innerHTML == 'number'){this.props.logElement.setDuration(this.durationRef.innerHTML)}
    if(this.startTimestampRef.current.value != 0){
      let tempDate = new Date(this.startTimestampRef.current.value)
      this.props.logElement.setStartTimestamp(tempDate.getTime())
    }
    if(this.customerRef.current.innerHTML != this.props.logElement.getCustomer()){this.props.logElement.setCustomer(this.customerRef.current.innerHTML)}
    if(this.durationRef.current.innerHTML != 0){this.props.logElement.setDuration(Math.abs(this.durationRef.current.innerHTML) * 1000 * 60 * 60)}
    if(this.customerRef.current.innerHTML != this.props.logElement.getCustomer()){this.props.logElement.setDescription(this.customerRef.innerHTML)}
    this.props.logElement.setType(Type[this.typeRef.current.value as keyof typeof Type])
    this.props.logElement.setRitNum(this.ritNumRef.current.innerHTML)
    this.props.logElement.setCaseNum(this.caseNumRef.current.innerHTML)
    this.props.logElement.setCaseTaskNum(this.caseTaskNumRef.current.innerHTML)
    this.props.logElement.setInternalTask(this.internalRef.current.checked);
    this.props.logElement.setUnpaid(this.unpaidRef.current.checked);
    this.props.logElement.setBookKeepReady(this.bookKeepReadyRef.current.checked);
  }
  //Type[..].value as keyof typeof Type
  printLogElement(){
    console.log(this.props.logElement)
    console.log(Type[this.typeRef.current.value as keyof typeof Type])
  }

  convertStartTimestamp():string{
    if(this.props.logElement.getStartTimestamp() != 0){
      let date = new Date(this.props.logElement.getStartTimestamp() * 1)
      console.log(this.props.logElement.getStartTimestamp())
      return date.toDateString();
    }else{
      return "";
    }
  }
  //<div ref={this.typeRef} className="Log-element-generic" style={{width:"14%"}}>{Type[this.props.logElement.getType()]}</div>
  render(){
    return(
          <div id="elementShell" className="Element-shell">
            <div style={{width:"1%", backgroundColor:"green",height:"100%"}} onClick={()=>{this.updateLogElementState()}}></div>
            <div style={{width:"1%", backgroundColor:"red",height:"100%"}} onClick={()=>{this.printLogElement()}}></div>
            <div ref={this.descriptionRef} className="Log-element-generic" contentEditable="true" style={{width:"30%",overflowY:"hidden"}}>{this.props.logElement.getDescription()}</div>
            <input ref={this.startTimestampRef} type="datetime-local" className="Date-picker" style={{height:"80%"}}></input>
            <select ref={this.typeRef} className="Log-element-generic" style={{width:"14%",borderColor:"transparent"}}>
              <option value="CalendarEvent">CalendarEvent</option>
              <option value="Mail">Mail</option>
              <option value="Meeting">Meeting</option>
              <option value="Call">Call</option>
            </select>
            <div ref={this.durationRef} className="Log-element-generic" contentEditable="true" style={{width:"3%"}}>{this.props.logElement.getDuration()}</div>
            <div ref={this.customerRef} className="Log-element-generic" contentEditable="true" style={{width:"15%"}}>{this.props.logElement.getCustomer()}</div>
            <div ref={this.ritNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getRitNum()}</div>
            <div ref={this.caseNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseNum()}</div>
            <div ref={this.caseTaskNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseTaskNum()}</div>
            <input ref={this.internalRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getInternalTask()} onChange={()=>{this.props.logElement.setInternalTask(!this.props.logElement.getInternalTask()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.unpaidRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getUnpaid()} onChange={()=>{this.props.logElement.setUnpaid(!this.props.logElement.getUnpaid()); this.forceUpdate(); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.bookKeepReadyRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getBookKeepReady()} onChange={()=>{this.props.logElement.setBookKeepReady(!this.props.logElement.getBookKeepReady()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <button className="Delete-button" onClick={()=>{this.props.markElementForDeletion(this.props.index)}}><img src={trashcan} style={{height:"100%",width:"200%",marginLeft:"-40%"}}></img></button>
          </div>
    )
  }
}