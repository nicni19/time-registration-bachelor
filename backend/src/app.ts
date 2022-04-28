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

//Azure test
app.get('/azureTest', async (req, res) => {
    /*
    console.log(req.headers.authorization)
    res.setHeader('Access-Control-Allow-Origin','*');
    res.status(201);
    res.send(req.header.toString())
    */
   //console.log("END RESULT: ",await core.authorizeUser('615498f0dae8d115',Actions.get_all_logs))
});

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

app.get('/authTest', async (req, res) => {
  let resVal:boolean = await core.authTest()

  if(await resVal == true){
    res.status(200);
    res.send(await resVal);
  }else{
    res.status(401);
    res.send(await resVal);
  }
  
});

app.get('/getLogElements/:startDate/:endDate', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.params.startDate);
  console.log(req.params.endDate);
  let startDate: Date;
  let endDate: Date;
  try {
    startDate = new Date(req.params.startDate.replace('T', ' '));
    endDate = new Date(req.params.endDate.replace('T', ' '));
    console.log(endDate);
    
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

  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);
  let requestJSON = JSON.parse(JSON.stringify(req.headers));
  console.log(requestJSON.userid);

  let logElements: LogElement[];
  let queryMap: Map<string,any> = new Map;
  queryMap.set("userid",requestJSON.userid);
  queryMap.set("startTime",startDate);
  queryMap.set("endTime",endDate);

  await core.graphUpdate(requestJSON.userid as string, token).then( async () => {
    logElements = await core.getLogElements(queryMap);
  });
  
  res.status(200);
  res.send(logElements);
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
      logElements = await core.getLogElements(requestJSON.userid);
    });
    
    res.status(200);
    res.send(logElements);
  }else{
    res.status(401).send("User: " + requestJSON.userid +" does not have privilege to perform this action");
  }
});

app.post('/insertLogElements', (req, res) => {
  
  core.insertLogElements(req.body);

  /*
  res.send('success')
  */
  res.send('Log elements inserted');
});

app.get('/getTimerRuns', (req, res) => {
  /*
  core.fetchTimerRuns
  */
  res.send('Timer runs');
});

app.post('/insertTimerRun', (req, res) => {
  /*
  core.insertTimerRun
  */
  res.send('Timer run inserted');
});

app.get('/getCalendar', async (req, res) => {

});



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
