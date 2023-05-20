//import 
const express=require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const corsMiddleware=require('./cors/cors')
const app=express();
const session = require('express-session');
const oracledb = require('oracledb');
const http = require('http');
const socketIO = require('socket.io');

//handle web socket
const server = http.createServer(app);
const io = socketIO(server);
//module.exports.io = io;
app.set('socketio', io);



//import router
var router = require('./route');
const cors = require('./cors/cors');

//configure headers

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
 // app.use(corsMiddleware)
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

// Configure the `express-session`
app.use(session({
  key:"userId",
  secret: 'secret', // secret key for session cookies 
  resave: false, // doesn't save the session at each request
  saveUninitialized: false, // don't create session for unauthentificated user
  cookie: { /*sameSite:'none'*/} 
}));

app.use('/', router);

const port =8000
server.listen(port,()=>{

    console.log(`App is running on ${port}`)
})
