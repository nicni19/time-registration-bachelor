import express, { json } from 'express';
import { Core } from './common/core';
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
   console.log(await core.getPrivileges('615498f0dae8d115'))
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

app.get('/getLogElements', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);
  let requestJSON = JSON.parse(JSON.stringify(req.headers));
  console.log(requestJSON.userid);

  let logElements: LogElement[];

  await core.graphUpdate(requestJSON.userid as string, token).then( async () => {
    logElements = await core.getLogElements(requestJSON.userid);
  });
  
  res.status(200);
  res.send(logElements);
});

app.post('/insertLogElements', (req, res) => {
  /*
  core.insertLogElementsIntoDB

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
