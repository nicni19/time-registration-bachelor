import express from 'express';
const app = express();
const port = 3000;
const request = require('request');
const { htmlToText } = require('html-to-text');
app.use(express.json());

let lastLookup: string = '202022-01-16T01:03:21.347Z';

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

  request.get('https://graph.microsoft.com/v1.0/me/events?$select=lastModifiedDateTime,subject,body,bodyPreview,organizer,attendees,start,end,location&$filter=lastModifiedDateTime%20ge%' + lastLookup, { json: true }, (err, res, body) => {
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

      responseJson.events.push(event);
    }
    response.send(responseJson);
  }).auth(null, null, true, token)
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
