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
}

export class LogView extends React.Component<LogViewProps>{

  elementViewRef:any;
  startPickerRef:any;
  endPickerRef:any;

  globalLogElements:LogElementComponent[];

  constructor(props:any){
    super(props)

    this.elementViewRef = React.createRef();
    this.startPickerRef = React.createRef();
    this.endPickerRef = React.createRef();

    this.globalLogElements = []
    
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
    //this.globalLogElements[index] = undefined;
    this.globalLogElements.map(log =>{
      log.updateLogElementState();
    });
    this.globalLogElements.splice(index,1);
    console.log("Index removed: " + index);
    this.rearrangeElementsArray();
    this.forceUpdate()
  }

  insertEmptyElement(){
    let newLogElement = new LogElement("",0,"",0,0,false,false,0,"",0,"",false,false,"","");
    let newLogElementComponent = new LogElementComponent({logElement:newLogElement,index:0,markElementForDeletion:this.markElementForDeletion,updateSpecificComponent:this.updateSpecificComponent});
    this.updateAllComponents()
    this.globalLogElements.unshift(newLogElementComponent)
    this.rearrangeElementsArray()
    this.forceUpdate()
  }

  async fetchLogElements(){
    this.globalLogElements = []
    this.forceUpdate();
    let startStamp:string = this.startPickerRef.current.value;
    let endStamp:string = this.endPickerRef.current.value;

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
    let logElements: LogElement[] = [];
    for (let i: number = 0; i < this.globalLogElements.length; i++) {
      await this.updateSpecificComponent(i);
      logElements.push(this.globalLogElements[i].props.logElement)
    }

    this.props.backendAPI.insertLogElements(logElements);
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

  testChangeDescription(){
    this.globalLogElements[0].props.logElement.setDescription("Heej!!")
    //this.globalLogElements[0].updateLogElementState();
    this.forceUpdate();
  }

  render(){
    return(
      <div id="outerView" className="Outer-view">
        <div style={{height:"8vh",backgroundColor:"transparent",width:"100%",display:"flex"}}>
          <div style={{display:"flex",height:"100%",justifyContent:"flex-start",flexDirection:"row"}}> 
            <input ref={this.startPickerRef} className="Date-picker" type="date" style={{height:"70%"}}></input>
            <input ref={this.endPickerRef} className="Date-picker" type="date" style={{height:"70%"}}></input>
            <div style={{width:"3vw",height:"78%",marginTop:"0.3vh",backgroundColor:"white",marginRight:"0.3vw",borderRadius:"3px",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{this.fetchLogElements()}}><img src={searchIcon} style={{height:"80%",width:"80%"}}></img></div>
            <div style={{width:"3vw",height:"78%",marginTop:"0.3vh",backgroundColor:"white",marginRight:"0.5vw",borderRadius:"3px",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{this.insertEmptyElement()}}><img src={newIcon} style={{height:"90%",width:"90%"}}></img></div>
          </div>
        </div>
        <div className="Field-identifier">
          <p className="Identifier-generic" style={{width:"4%",borderRightWidth:"0.1vh"}}>SAVE</p>
          <p className="Identifier-generic" style={{width:"26%",borderRightWidth:"0.1vh"}}>Description</p>
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
          <p className="Identifier-generic" style={{width:"4%",borderRightWidth:"0.1vh"}}>DELETE</p>
        </div>
        <div ref={this.elementViewRef} id="elementView" className="Element-view">
          {
            this.globalLogElements.map(log =>{
              return log.render();
            })
          }
        </div>
        <button className="Commit-button" onClick={async()=>{this.saveLogElements()}}>Submit changes to database</button>
      </div>
    )
  }
}