import React from "react";
import { LogElement } from "../common/LogElement";
import './stylesheets/LogElementComponent.css'

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
    console.log("Hello", this.startTimestampRef.current.value);
    
    if(this.customerRef.current.innerHTML != this.props.logElement.getCustomer()){this.props.logElement.setCustomer(this.customerRef.current.innerHTML)}
    if(this.durationRef.current.innerHTML != 0){this.props.logElement.setDuration(Math.abs(this.durationRef.current.innerHTML) * 1000 * 60 * 60)}
    if(this.customerRef.current.innerHTML != this.props.logElement.getCustomer()){this.props.logElement.setDescription(this.customerRef.innerHTML)}
    this.props.logElement.setRitNum(this.ritNumRef.current.innerHTML)
    this.props.logElement.setCaseNum(this.caseNumRef.current.innerHTML)
    this.props.logElement.setCaseTaskNum(this.caseTaskNumRef.current.innerHTML)
    this.props.logElement.setInternalTask(this.internalRef.current.checked);
    this.props.logElement.setUnpaid(this.unpaidRef.current.checked);
    this.props.logElement.setBookKeepReady(this.bookKeepReadyRef.current.checked);
  }

  printLogElement(){
    console.log(this.props.logElement)
  }

  convertStartTimestamp():string{
    if(this.props.logElement.getStartTimestamp() != 0){
      let date = new Date(this.props.logElement.getStartTimestamp() * 1)
      console.log(this.props.logElement.getStartTimestamp())
      let finalDate:string = date.getDay() + " | " + date.getMonth() + " | " + date.getFullYear()
      return date.toDateString();
    }else{
      return "";
    }
  }

  returnDateString():string {
    console.log(typeof this.props.logElement.getStartTimestamp());
    
    let dateString = new Date(this.props.logElement.getStartTimestamp()).toISOString().split('Z')[0];
    console.log(dateString);
    
    return dateString;
  }

  render(){
    return(
          <div id="elementShell" className="Element-shell">
            <div style={{width:"1%", backgroundColor:"green",height:"100%"}} onClick={()=>{this.updateLogElementState()}}></div>
            <div style={{width:"1%", backgroundColor:"red",height:"100%"}} onClick={()=>{this.printLogElement()}}></div>
            <div ref={this.descriptionRef} className="Log-element-generic" contentEditable="true" style={{width:"24%",overflowY:"hidden"}}>{this.props.logElement.getDescription()}</div>
            <input ref={this.startTimestampRef} type="datetime-local" className="Date-picker" defaultValue={this.returnDateString()}></input>
            <div ref={this.typeRef} className="Log-element-generic" style={{width:"10%"}}>{this.props.logElement.getType()}</div>
            <div ref={this.durationRef} className="Log-element-generic" contentEditable="true" style={{width:"3%"}}>{this.props.logElement.getDuration()}</div>
            <div ref={this.customerRef} className="Log-element-generic" contentEditable="true" style={{width:"15%"}}>{this.props.logElement.getCustomer()}</div>
            <div ref={this.ritNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getRitNum()}</div>
            <div ref={this.caseNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseNum()}</div>
            <div ref={this.caseTaskNumRef} className="Log-element-generic" contentEditable="true" style={{width:"5%"}}>{this.props.logElement.getCaseTaskNum()}</div>
            <input ref={this.internalRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getInternalTask()} onChange={()=>{this.props.logElement.setInternalTask(!this.props.logElement.getInternalTask()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.unpaidRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getUnpaid()} onChange={()=>{this.props.logElement.setUnpaid(!this.props.logElement.getUnpaid()); this.forceUpdate(); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.bookKeepReadyRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getBookKeepReady()} onChange={()=>{this.props.logElement.setBookKeepReady(!this.props.logElement.getBookKeepReady()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <button className="Delete-button" onClick={()=>{this.props.markElementForDeletion(this.props.index)}}>|_|</button>
          </div>
    )
  }
}