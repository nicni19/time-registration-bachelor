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
    
    if(this.descriptionRef.current.value != this.props.logElement.getDescription()){
      this.props.logElement.setDescription("" + this.descriptionRef.current.value)
    }
    if(this.durationRef.current.innerHTML != this.props.logElement.getDuration() && typeof this.durationRef.innerHTML == 'number'){this.props.logElement.setDuration(this.durationRef.innerHTML)}
    if(this.startTimestampRef.current.value != 0){
      let tempDate = new Date(this.startTimestampRef.current.value)
      
      this.props.logElement.setStartTimestamp(tempDate.getTime())
    }
    if(this.customerRef.current.value != this.props.logElement.getCustomer()){this.props.logElement.setCustomer(this.customerRef.current.value)}
    if(this.durationRef.current.value != 0){this.props.logElement.setDuration(Math.abs(this.durationRef.current.value) * 1000 * 60 * 60)}
    this.props.logElement.setType(parseInt(this.typeRef.current.value))
    this.props.logElement.setRitNum(this.ritNumRef.current.value.toUpperCase())
    this.props.logElement.setCaseNum(this.caseNumRef.current.value)
    this.props.logElement.setCaseTaskNum(this.caseTaskNumRef.current.value)
    this.props.logElement.setInternalTask(this.internalRef.current.checked);
    this.props.logElement.setUnpaid(this.unpaidRef.current.checked);
    this.props.logElement.setBookKeepReady(this.bookKeepReadyRef.current.checked);
  }
  //Type[..].value as keyof typeof Type
  printLogElement(){
    console.log(this.props.logElement)
  }

  convertStartTimestamp():string{
    if(this.props.logElement.getStartTimestamp() != 0){
      let date = new Date(this.props.logElement.getStartTimestamp() * 1);
      return date.toDateString();
    }else{
      return "";
    }
  }

  returnDateString():string {

    let timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
    let dateString = new Date(this.props.logElement.getStartTimestamp() - timeZoneOffset).toISOString().split('Z')[0];
    
    return dateString;
  }

  returnHours() {
    let hours = (((this.props.logElement.getDuration() / 1000)/60)/60);
    return hours;
  }

  render(){
    return(
          <div id="elementShell" className="Element-shell" onClick={()=>{this.printLogElement()}}>
            <textarea ref={this.descriptionRef} className="Log-element-generic" style={{width:"24%",overflowY:"hidden",maxWidth:"24%",minWidth:"24%",resize:"none",maxHeight:"80%",border:"none",outline:"none"}} defaultValue={this.props.logElement.getDescription()}></textarea>
            <input ref={this.startTimestampRef} type="datetime-local" className="Component-date-picker" defaultValue={this.returnDateString()} style={{maxWidth:"16%",minWidth:"16%",maxHeight:"80%"}}></input>
            <select ref={this.typeRef} className="Log-element-generic" defaultValue={this.props.logElement.getType()} style={{width:"14%",borderColor:"transparent"}} >
              <option value={0}>CalendarEvent</option>
              <option value={1}>Mail</option>
              <option value={2}>Meeting</option>
              <option value={3}>Call</option>
            </select>
            <input ref={this.durationRef} className="Log-element-generic" onKeyPress={(event) => {if(!/[0-9,\.]/.test(event.key)){event.preventDefault();}}} style={{width:"3%",maxHeight:"75%",borderColor:"transparent"}} defaultValue={this.returnHours()}></input>
            <textarea ref={this.customerRef} className="Log-element-generic" style={{width:"15%",maxHeight:"80%",resize:"none",border:"none",outline:"none"}} defaultValue={this.props.logElement.getCustomer()}></textarea>
            <input ref={this.ritNumRef} id="Rit-num-input" className="Log-element-generic" maxLength={10} onKeyPress={(event) => {if(!/[0-9,R,r,I,i,T,t,-]/.test(event.key)){event.preventDefault();}}} style={{width:"5%"}} defaultValue={this.props.logElement.getRitNum()}></input>
            <input ref={this.caseNumRef} id="Case-num-input" className="Log-element-generic" maxLength={10} style={{width:"5%"}} defaultValue={this.props.logElement.getCaseNum()}></input>
            <input ref={this.caseTaskNumRef} id="Case-task-num-input" className="Log-element-generic" maxLength={10} onKeyPress={(event) => {if(!/[0-9]/.test(event.key)){event.preventDefault();}}} style={{width:"5%"}} defaultValue={this.props.logElement.getCaseTaskNum()}></input>
            <input ref={this.internalRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getInternalTask()} onChange={()=>{this.props.logElement.setInternalTask(!this.props.logElement.getInternalTask()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.unpaidRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getUnpaid()} onChange={()=>{this.props.logElement.setUnpaid(!this.props.logElement.getUnpaid()); this.forceUpdate(); this.props.updateSpecificComponent(this.props.index)}}></input>
            <input ref={this.bookKeepReadyRef} className="Log-element-checkbox" type="checkbox" checked={this.props.logElement.getBookKeepReady()} onChange={()=>{this.props.logElement.setBookKeepReady(!this.props.logElement.getBookKeepReady()); this.props.updateSpecificComponent(this.props.index)}}></input>
            <button className="Delete-button" style={{display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{this.props.markElementForDeletion(this.props.index)}}><img src={trashcan} style={{height:"50%",width:"80%",color:"yellow"}}></img></button>
          </div>
    )
  }
}