const session = require('express-session');
const fetch = require("node-fetch");


exports.get_users= async function(req,res){
    
    const list_users= await fetch('http://34.248.236.103:3000/students').then(response =>response.json()).then(data=>{return data})
    res.send(list_users)
    
}

exports.authentification=async function(req,res){
    
    const student_id="rb234016"
    const student_password="rb234016"
    const resp= await fetch('http://34.248.236.103:3000/authorized', 
        {   
            method:'POST',
            body:JSON.stringify({student_id: student_id,student_password: student_password}),
            headers:{'Content-Type': 'application/json'}
        }
        ).then(response =>response.json()).then(data=>{console.log(data)

            if(data==1){
                req.session.userId=student_id
                
                res.send("auth succes")
            }
            else{
                res.send("auth failed")
            }
        })
      .catch(function (error) { 
        console.log(error);
      });
      
      
}

exports.get_profil= async function(req,res){
    const sid="rb234016"
    
    fetch('http://34.248.236.103:3000/student?id='+sid).then(response => response.json()).then(data => {console.log(data)});
    res.send("finish")
    
    
}  

exports.log_out=async function(req,res){

    //destroy the session of the connected user
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.send('u are log out'); 
        }
      });
}