import express, { json } from 'express';
import { Core } from './common/core';
import { LogElement } from './common/domain/LogElement';
const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
app.use(express.json());

const core: Core = new Core();
let lastLookup: string = '202022-01-16T01:03:21.347Z';

//Azure test
app.get('/azureTest', async (req, res) => {

    /*
    //Test ting
    let testElement = new LogElement('6fc4dcd488b119e7','type',null,"This is the description",1648797418621,100,true,false,true,false);
    let testArray:LogElement[] = [];
    testArray.push(testElement); 
    let returnVal = await core.azureTest(testArray);
    //console.log(returnVal);
    res.send(returnVal);
    */
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

  await core.graphUpdate(requestJSON.userid as string, token).then( async () => {
    logElements = await core.getLogElements(requestJSON.userid);
  });
  
  res.status(200);
  res.send(logElements);
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
