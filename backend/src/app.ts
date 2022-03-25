import express, { json } from 'express';
import { Core } from './common/core';

const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
app.use(express.json());

let core: Core = new Core();
let lastLookup: string = '202022-01-16T01:03:21.347Z';

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

app.get('/getCalendar', (req, response) => {
  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);

  request.get('https://graph.microsoft.com/v1.0/me/events?$select=subject,body,start,end&$filter=lastModifiedDateTime%20ge%' + lastLookup, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    if (!body.value) {
      response.send("error");
      return console.log(body);
    }
    let responseJson = {'events': []};

    for (let i = 0; i < body.value.length; i++) {
      let event: string = htmlToText(body.value[i].body.content, {
        wordWrap: false,
      })

      let startTime = ((body.value[i].end.dateTime).replace(/-/g,'/'));
      console.log(startTime);
      let dateTime = new Date(startTime.replace('T', ' '));
      console.log(dateTime.valueOf());
      
      let jsonElement = {
        'id': body.value[i].id,
        'description': body.value[i].subject + ': ' + event,
        'startTime': body.value[i].start.dateTime,
        'duration': dateTime.valueOf() 
      }

      responseJson.events.push(jsonElement);
      console.log(responseJson);
    }
    response.send(responseJson);
  }).auth(null, null, true, token)
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
