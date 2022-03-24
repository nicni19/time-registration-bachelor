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

app.get('/getCalendar/:id', (req, response) => {
  let token: string = req.headers.authorization.split(' ')[1];
  console.log(token);

  let jsonResponse = core.graphUpdate(req.params.id, token);
  console.log(jsonResponse);
  response.send(jsonResponse);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
