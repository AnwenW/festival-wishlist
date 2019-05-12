'use strict';

const express = require('express');

const body = require('body-parser');

const uuid = require('uuid');

const db = require('./db');

const app = express();

app.use(express.static('public'));

app.get('/api/dreams', async function (request, response) {

  response.send(await db.getDreams());
});

const parseJson = body.json();

app.post('/api/dreams', parseJson, async function (request, response) {

  const dream = { name: request.body.name, description: request.body.description, date: request.body.date, count: 0, id: uuid.v4() };
  
  await db.createDream(dream); 
  
  response.status(201).send(dream); 
});

app.post('/api/dreams/:id/vote', async function (request, response) {
  let dream;
  
  try {
    dream = await db.vote(request.params.id); 
  } catch (e) {
    return response.sendStatus(404); 
  }
  
  response.send(dream);
});

app.delete('/api/dreams/:id', async function (request, response) {
  try {
    await db.deleteDream(request.params.id);
  } catch (e) {
    console.error(e);
  }

  response.sendStatus(204);
});

db.ready.then(function () {
  app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + process.env.PORT);
  });
});
