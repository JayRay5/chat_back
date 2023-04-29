//import express
const express=require('express');
var bodyParser = require('body-parser')
const corsMiddleware=require('./cors/cors')
const app=express();
const session = require('express-session');
//import router
var router = require('./route');

//configure headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.options('*', corsMiddleware)
  app.use(corsMiddleware)

// Configure the `express-session`
app.use(session({
  secret: 'secret', // secret key for session cookies 
  resave: false, // doesn't save the session at each request
  saveUninitialized: false // don't create session for unauthentificated user
}));

app.use('/', router);

const port =8000
app.listen(port,()=>{

    console.log(`App is running on ${port}`)
})
