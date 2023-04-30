//import
const oracledb = require('oracledb');

const session = require('express-session');
const fetch = require("node-fetch");

const dbConfig= require('../db_config');
const { password } = require('../db_config');

exports.get_users= async function(req,res){
    
    const list_users= await fetch('http://34.248.236.103:3000/students').then(response =>response.json()).then(data=>{return data})
    res.send(list_users)
    
}

exports.authentification=async function(req,res){
    console.log(req.body.userId)
    const student_id=req.body.userId
    const student_password=req.body.password
    console.log(password)
    const resp= await fetch('http://34.248.236.103:3000/authorized', 
        {   
            method:'POST',
            body:JSON.stringify({student_id: student_id,student_password: student_password}),
            headers:{'Content-Type': 'application/json'}
        }
        ).then(response =>response.json()).then(data=>{
            console.log(data)
            if(data==1){
                req.session.userId=student_id  
                console.log(req.session)
                res.setHeader('Set-Cookie', `sessionId=${req.session.userId}`);
                res.send({isConnected:true,userId:req.session.userId,message:"auth succes"})
            }
            else{
                res.send({isConnected:false,message:"auth failed"})
            }
        })
      .catch(function (error) { 
        console.log(error);
      });
      
      
}

exports.get_profil= async function(req,res){
    

    //fetch('http://34.248.236.103:3000/student?id='+req.session.userId).then(response => response.json()).then(data => {console.log(data)});
    
    
    
}  

//check if the user is in the chat database
//else, register it
exports.check_user= async function(req,res){
    console.log(dbConfig)
    const connexion= await oracledb.getConnection(dbConfig)

    //const exec= await connexion.execute('SELECT * FROM User WHERE username='+req.session.userId)
    console.log(exec)
}

exports.log_out=async function(req,res){

    //destroy the session of the connected user
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.send({isConnected:false,message:'u are log out'}); 
        }
      });

      res.send("end")
}