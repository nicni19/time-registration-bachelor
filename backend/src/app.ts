import express, { json } from 'express';
import { Core } from './common/core';
const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
app.use(express.json());

const core: Core = new Core();
let lastLookup: string = '202022-01-16T01:03:21.347Z';

//Azure test
app.get('/azureTest', async (req, res) => {
    //Test ting
    let returnVal = await core.azureTest();
    console.log(returnVal);
    res.send(returnVal);
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

app.get('/getLogElements', (req, res) => {
  /*
  core.insertGraphElementsToDB(token)

  logElements = core.fetchLogElements(userID, params)

  res.send(logElements)
  */

  res.send('Log elements');
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

app.get('/getCalendar/:id', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.headers.authorization) {
    res.status(401);
    res.send({'Message': 'Auth token missing'});
    return;
  }
  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);
  let username: string = req.headers.authorization.split(' ')[3];
  console.log(username);

  let jsonResponse = await core.graphUpdate(username, token);
  
  res.status(200);
  res.send(jsonResponse);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
