import { stringify } from "querystring";
import React, { RefObject } from "react";
import {ClientHandler} from '../common/ClientHandler'

type UserBoxProps = {
    isLoggedIn:boolean;
    clientHandler:ClientHandler;
}

class UserBox extends React.Component<UserBoxProps>{
    
    profilePictureUrl:string = "";
    infoBoxRef:any;
    pictureRef:any;
    nameRef:any;
    emailRef:any;
    
    constructor(props:any){
        super(props)
        this.state = {
            url:null
        }
        this.infoBoxRef = React.createRef();
        this.pictureRef = React.createRef();
        this.nameRef = React.createRef();
        this.emailRef = React.createRef();
    }

    async componentDidMount(){
        let url = await this.props.clientHandler.getAccountPhoto();
        if(await url != null){
            //Display user photo
            this.pictureRef.current.setAttribute('src',url);
        }
        let clientInfoArray = await this.props.clientHandler.getNameAndEmail();
        if(await clientInfoArray){
            //Display user name
            this.nameRef.current.innerHTML = clientInfoArray[0] + " " + clientInfoArray[1];
            //Display email
            this.emailRef.current.innerHTML = clientInfoArray[2];
        } 
    }

    async test(){
        this.props.clientHandler.getNameAndEmail();
    }

    render(){
        if(this.props.isLoggedIn){
            return(
                <div style={{backgroundColor:"lightgrey",margin:"15px",height:"auto",paddingBottom:"10px",paddingTop:"10px"}}>
                    <img ref={this.pictureRef} style={{width:100,height:100,borderRadius:"50%"}}></img>
                    <p ref={this.nameRef}>[Username]</p>
                    <p ref={this.emailRef} style={{fontSize:"small"}}>[Email]</p>
                    <button onClick={()=>{this.test()}}>Click me!</button>
                </div>
            )
        }else{
            return(
                <div>Empty</div>
            )
        }
    }
}

export default UserBox;