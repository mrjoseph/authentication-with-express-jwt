const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const _ = require('lodash');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/api', (req,res) => {
  res.json({
    test: 'my api'
  })
});
const mockDB = {
  username: 'Tony Stark',
  emailAddress: 'tony.stark@starkindustries.com',
  password: 'ironman1',

};

const checkLogin = (req, res, next) => {
  if(_.isEqual(req.body, mockDB)) {
    next();
  } else {
    res.sendStatus(403);
  }
};
app.post('/api/login',checkLogin, (req, res) => {
  // auth user
  const user = {
    id: 3,
    username: mockDB.username,
    emailAddress: mockDB.emailAddress,
  };
  const token = jwt.sign({ user }, 'my_secret_key');
  res.json({
    token,
  });
});
const ensureToken = (req,res,next) => {
  const beareHeader = req.headers["authorization"];
  if(typeof beareHeader !== 'undefined') {
    const bearer = beareHeader.split(" ");
    req.token = bearer[1];
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get('/api/protected',ensureToken, (req, res) => {
  jwt.verify(req.token, 'my_secret_key', (err, data) => {
    if(err){
      res.sendStatus(403);
    } else {
      res.json({
        text: 'this is protected',
        data
      });
    }
  });
});



app.listen('2000', () => {
  console.log('listening on port 20000');
});
