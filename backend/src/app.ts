import express, { json } from 'express';
import { Core } from './common/core';
import { Actions } from './common/domain/Actions';
import { LogElement } from './common/domain/LogElement';
const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
const cors = require('cors');
app.use(express.json());
app.use(cors());

const core: Core = new Core();
let lastLookup: string = '202022-01-16T01:03:21.347Z';

app.get('/doesCurrentUserExist', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let responseJSON = JSON.parse(JSON.stringify(req.headers))

  let userExist: boolean = await core.doesUserExist(responseJSON.userid);

  if (userExist == true) {
    res.status(200);
    res.send({'userFound':userExist});
  } else {
    res.status(404);
    res.send({'userFound':userExist});
  }

});

app.use(async (req,res,next)=>{
  //TODO: Undooo jank
  let requestAuthenticated:boolean = false;
  let requestJSON = JSON.parse(JSON.stringify(req.headers));

  //Respons with a 401 if the token or userID is missing
  if(!req.headers.authorization || !req.headers.userid){
    res.status(401);
    res.send({'Message':'Token or userID missing'})
    return;
  }else{
    //If the token and userID is present, the request is authenticated.
    requestAuthenticated = await core.authenticateUser(requestJSON.userid,(requestJSON.authorization.split(' ')[1]));
  }
  console.log("USER AUTHENTICATED: " + requestAuthenticated);

  if(await requestAuthenticated == true){
    next();
  }else{
    res.status(401);
    res.send(false);
  }
});

app.get('/getPreferences',async (req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  let requestJSON = JSON.parse(JSON.stringify(req.headers));

  res.status(200)
  res.send(await core.getPreferences(requestJSON.userid))
});

app.post('/setPreferences',async(req,res)=>{
  console.log(req.body.preferences)
  let requestJSON = JSON.parse(JSON.stringify(req.headers))

  core.updatePreferences(requestJSON.userid,[req.body.preferences[0],req.body.preferences[1]])
});

app.get('/getLogElements/:startDate/:endDate', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let startDate: Date;
  let endDate: Date;

  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);
  let requestJSON = JSON.parse(JSON.stringify(req.headers));
  console.log(requestJSON.userid);
  
  //AUTHORIZATION: Cheks if the user has the privilege to perform the given action
  if(await core.authorizeUser(requestJSON.userid,Actions.get_logs_for_current_user)){
    try {
      startDate = new Date(req.params.startDate.replace('T', ' '));
      endDate = new Date(req.params.endDate.replace('T', ' '));
      
      if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
        throw "Parameters are not correct date strings. Format should be like this: '2022-04-04T00:00:00.0000000'." 
        + " URL should be /getLogElements/'startDate'/'endDate'";
      }
      if (startDate.valueOf() > endDate.valueOf()) {
        throw "Start date is later than the end date";
      }
  
    } catch (error) {
      res.status(400);
      res.send({
        ErrorMessage: error
      });
      return;
    }

    let logElements: LogElement[];
    let queryMap: Map<string,any> = new Map;
    queryMap.set("userid",requestJSON.userid);
    queryMap.set("startTime",startDate);
    queryMap.set("endTime",endDate);

    await core.graphUpdate(requestJSON.userid as string, token).then( async () => {
      logElements = await core.getLogElements(queryMap);
    });
    
    res.status(200);
    res.send({
      'logElements': logElements
    });
  }else{
    res.status(401).send("User: " + requestJSON.userid +" does not have privilege to perform this action");
  }
});

app.get('/getLogElements', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);
  let requestJSON = JSON.parse(JSON.stringify(req.headers));
  console.log("User ID: ",requestJSON.userid);

  //AUTHORIZATION: Cheks if the user has the privilege to perform the given action
  if(await core.authorizeUser(requestJSON.userid,Actions.get_logs_for_current_user)){
    let logElements: LogElement[];
    let queryMap: Map<string,any> = new Map;
    queryMap.set("userid",requestJSON.userid);

    await core.graphUpdate(requestJSON.userid as string, token).then( async () => {
      logElements = await core.getLogElements(queryMap);
    });
    
    res.status(200);
    res.send({
      'logElements':logElements
    });
  }else{
    res.status(401).send("User: " + requestJSON.userid +" does not have privilege to perform this action");
  }
});

app.post('/insertLogElements', (req, res) => {
  
  if (core.insertLogElements(req.body.logElements)) {
    res.status(200)
    res.send({
      message: 'Log elements inserted'
    }); 
  } else {
    res.status(500);
    res.send({
      message: 'An error occured. Log elements not saved!'
    });
  }
});

app.post('/deleteLogElements', async (req, res) => {
  let responseJSON = JSON.parse(JSON.stringify(req.headers));

  if (core.deleteLogElements(req.body.ids,responseJSON.userid)) {
    res.status(200)
    res.send({
      message: 'Log elements deleted'
    }); 
  } else {
    res.status(500);
    res.send({
      message: 'An error occured. Log elements not deleted!'
    });
  }
});

app.get('/deleteTimerRun', async (req, res) => {

});

app.get('/getTimerRuns', (req, res) => {
  /*
  core.fetchTimerRuns
  */
  res.send('Endpoint not implemented');
});

app.post('/insertTimerRun', (req, res) => {
  /*
  core.insertTimerRun
  */
  res.send('Endpoint not implemented');
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
