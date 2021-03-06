import React from "react";
import { BackendAPI } from "../common/BackendAPI";
import { LogElement } from "../common/LogElement";
import { LogElementComponent } from "./LogElementComponent";
import './stylesheets/LogView.css'
import refreshIcon from '../public/refresh.png'
import newIcon from '../public/new.png'
import searchIcon from '../public/search.png'

type LogViewProps = {
  backendAPI:BackendAPI;
  userID:string;
}

export class LogView extends React.Component<LogViewProps>{

  elementViewRef:any;
  startPickerRef:any;
  endPickerRef:any;

  globalLogElements:LogElementComponent[];
  iDsForDeletion:any[];

  constructor(props:any){
    super(props)

    this.elementViewRef = React.createRef();
    this.startPickerRef = React.createRef();
    this.endPickerRef = React.createRef();

    this.globalLogElements = []
    this.iDsForDeletion = []
    
    this.markElementForDeletion = this.markElementForDeletion.bind(this);
    this.updateSpecificComponent = this.updateSpecificComponent.bind(this);
  }

  componentDidMount(){
    let today = new Date();
    let days = 5, endDate = days * 86400000;
    let fiveDaysLater = new Date((Date.now() + endDate));
    
    this.startPickerRef.current.defaultValue = today.toISOString().split('T')[0];
    this.endPickerRef.current.defaultValue = fiveDaysLater.toISOString().split('T')[0];
  }

  rearrangeElementsArray(){
    //Tag globalElements, smid dem én efter én i et nyt array hvor deres prop.index opdateres til deres nye plads. Lad globalElements == temp aray
    let newArray:any[] = [];
    for(let i = 0; i < this.globalLogElements.length;i++){
      if(this.globalLogElements[i] != undefined){
        let current:LogElementComponent = this.globalLogElements[i];      
        
        newArray.push(new LogElementComponent({logElement:current.props.logElement,index:i,markElementForDeletion:this.markElementForDeletion,updateSpecificComponent:this.updateSpecificComponent}))
      }
    }
    this.globalLogElements = newArray;
    
  }

  //TODO: Indsæt elementet som skal slettes i et separat array -> query til db
  markElementForDeletion(index:number){
    if(this.globalLogElements[index].props.logElement.getId() != undefined){
      this.iDsForDeletion.push(this.globalLogElements[index].props.logElement.getId())
    }
    this.globalLogElements.map(log =>{
      log.updateLogElementState();
    });
    this.globalLogElements.splice(index,1);
    console.log("Index removed: " + index);
    this.rearrangeElementsArray();
    this.forceUpdate();
    console.log(this.iDsForDeletion)
  }

  insertEmptyElement(){
    let newLogElement = new LogElement(this.props.userID,0,"",Date.now(),0,false,false,"","",0,"",false,false,null,null);
    let newLogElementComponent = new LogElementComponent({logElement:newLogElement,index:0,markElementForDeletion:this.markElementForDeletion,updateSpecificComponent:this.updateSpecificComponent});
    this.updateAllComponents()
    this.globalLogElements.push(newLogElementComponent)
    this.rearrangeElementsArray()
    this.forceUpdate()
  }

  async fetchLogElements(){
    this.globalLogElements = []
    this.iDsForDeletion = []
    this.forceUpdate();
    let startStamp:string = this.startPickerRef.current.value;
    let endDate:number = new Date(this.endPickerRef.current.value).valueOf();
    let endStamp:string = new Date(endDate + 86400000).toISOString().split('T')[0];
    console.log("end ",endStamp);
    

    let elements:any = await this.props.backendAPI.getLogElements(startStamp,endStamp);
    if(elements){
      for(let i = 0; i < elements.logElements.length; i++){

        let current = elements.logElements[i];
        
        let newLogElement = new LogElement(current.userID,current.type,current.description,current.startTimestamp,current.duration,current.internalTask,current.unpaid,current.ritNum,current.caseNum,current.caseTaskNum,current.customer,current.edited,current.bookKeepReady,current.calendarid,current.mailid,current.id);
        
        this.globalLogElements.push(new LogElementComponent({logElement:newLogElement,index:i,markElementForDeletion:this.markElementForDeletion,updateSpecificComponent:this.updateSpecificComponent}));

      }
      this.forceUpdate();
    }
  }

  async saveLogElements() {
    //Send log elements to backend
    let logElements: LogElement[] = [];
    for (let i: number = 0; i < this.globalLogElements.length; i++) {
      await this.globalLogElements[i].updateLogElementState();
      logElements.push(this.globalLogElements[i].props.logElement)
    }

    this.props.backendAPI.insertLogElements(logElements);
    
    //Send IDs for deletion to backend
    this.props.backendAPI.deleteLogElements(this.iDsForDeletion)
    this.iDsForDeletion = []
  }

  updateSpecificComponent(currentIndex:number){
    this.globalLogElements[currentIndex].updateLogElementState();
    this.globalLogElements[currentIndex].forceUpdate();
    this.forceUpdate()
  }

  updateAllComponents(){
    this.globalLogElements.map(element => {
      element.updateLogElementState()
    })
  }

  render(){
    return(
      <div id="outerView" className="Outer-view">
        <div style={{height:"8vh",backgroundColor:"transparent",width:"100%",display:"flex"}}>
          <div style={{display:"flex",height:"100%",justifyContent:"flex-start",flexDirection:"row"}}> 
            <input ref={this.startPickerRef} className="Date-picker" type="date"></input>
            <input ref={this.endPickerRef} className="Date-picker" type="date"></input>
            <div className="Log-toolbar-button" onClick={()=>{this.fetchLogElements()}}><img id="Search-icon" src={searchIcon}></img></div>
            <div className="Log-toolbar-button" onClick={()=>{this.insertEmptyElement()}}><img id="New-icon" src={newIcon}></img></div>
          </div>
        </div>
        <div className="Field-identifier">
          <p className="Identifier-generic" style={{width:"25%",borderRightWidth:"0.1vh"}}>Description</p>
          <p className="Identifier-generic" style={{width:"17%",borderRightWidth:"0.1vh"}}>Start time</p>
          <p className="Identifier-generic" style={{width:"12%",borderRightWidth:"0.1vh"}}>Type</p>
          <p className="Identifier-generic" style={{width:"3.5%",borderRightWidth:"0.1vh"}}>Dur.</p>
          <p className="Identifier-generic" style={{width:"14.5%",borderRightWidth:"0.1vh"}}>Customer</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh"}}>Rit num</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh"}}>Case num</p>
          <p className="Identifier-generic" style={{width:"5%",borderRightWidth:"0.1vh",marginRight:"0.3vw"}}>Case task</p>
          <p className="Identifier-generic" style={{width:"4%",borderRightWidth:"0.1vh"}}>Int.</p>
          <p className="Identifier-generic" style={{width:"4%",borderRightWidth:"0.1vh",marginLeft:"-0.1vw"}}>Up.</p>
          <p className="Identifier-generic" style={{width:"4%",borderRightWidth:"0.1vh",marginLeft:"0.2vw"}}>Ready</p>
        </div>
        <div ref={this.elementViewRef} id="elementView" className="Element-view">
          {
            this.globalLogElements.map(log =>{
              return <div id="Element-shell" key={log.props.logElement.getId()}> {log.render()} </div>;
            })
          }
        </div>
        <button className="Commit-button" onClick={async()=>{this.saveLogElements()}}>Submit changes to database</button>
      </div>
    )
  }
}