import express from 'express';
import { Core } from './common/core';
const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
app.use(express.json());

const core = new Core();

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
  console.log(jsonResponse);
  
  res.status(200);
  res.send(jsonResponse);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
