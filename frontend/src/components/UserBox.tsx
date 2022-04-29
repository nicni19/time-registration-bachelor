import React from "react";
import {ClientHandler} from '../common/ClientHandler'

type UserBoxProps = {
    isLoggedIn:boolean;
    clientHandler:ClientHandler;
}

class UserBox extends React.Component<UserBoxProps>{
    constructor(props:any){
        super(props)

    }

    async test(){
        console.log("ButtonPressseeeed")
        console.log(await this.props.clientHandler.getSilentAccessToken())
    }

    render(){
        if(this.props.isLoggedIn){
            return(
                <div style={{backgroundColor:"blue",margin:"15px",height:"150px"}}>
                    <div style={{backgroundColor:"red",marginLeft:"15px",height:"70%"}}>
                        <div style={{backgroundColor:"rebeccapurple",width:"45%",height:"100%",borderRadius:"50%"}}></div>
                        <button onClick={()=>{this.test()}}>Click me!</button>
                    </div>
                </div>
            )
        }else{
            return(
                <div style={{backgroundColor:"yellow",margin:"15px",height:"150px"}}>
                    <div style={{backgroundColor:"green",marginLeft:"15px",height:"70%"}}>
                        <div style={{backgroundColor:"rebeccapurple",width:"45%",height:"100%",borderRadius:"50%"}}></div>
    
                    </div>
                </div>
            )
        }
    }
}

export default UserBox;