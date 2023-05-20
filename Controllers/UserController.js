//import
const oracledb = require('oracledb');

const session = require('express-session');
const fetch = require("node-fetch");

const dbConfig= require('../db_config');

//return all users
exports.get_users= async function(req,res){
   if(req.session.userId){
    
        const list_users= await fetch('http://34.248.236.103:3000/students').then(response =>response.json()).then(data=>{return data})
        res.send(list_users)    
    }
    else{
        res.send("You are not connected")
    }
}

exports.get_users_filtered= async function(req,res){
   
    const connexion= await oracledb.getConnection(dbConfig)

    const result= await connexion.execute(`SELECT DISTINCT "User".*
    FROM "User"
    LEFT JOIN "DISCUSSVIA"  ON "DISCUSSVIA".username = "User".username
    WHERE  NOT EXISTS (
        SELECT 1
        FROM "DISCUSSVIA"
        WHERE "DISCUSSVIA".username = "User".username
          AND "DISCUSSVIA".chat_id = :chatId
      )`,{chatId:req.session.chatId})
    connexion.close()
    res.send(result)
    
    //const list_users= await fetch('http://34.248.236.103:3000/students').then(response =>response.json()).then(data=>{return data})
    
}

//authentificate the user
exports.authentification=async function(req,res){
    console.log(req.body.userId)
    const student_id=req.body.userId
    const student_password=req.body.password
    console.log(student_password)
    const resp= await fetch('http://34.248.236.103:3000/authorized', 
        {   
            method:'POST',
            body:JSON.stringify({student_id: student_id,student_password: student_password}),
            headers:{'Content-Type': 'application/json'}
        }
        ).then(response =>response.json()).then(async function(data){
            console.log(data)
            if(data==1){
                req.session.userId=student_id 
                //check if the user is in the chat database
                const connexion= await oracledb.getConnection(dbConfig)

                const result= await connexion.execute(`SELECT * FROM "User" WHERE username=:userId`,{userId:req.session.userId})
                if(result.rows && result.rows.length==0){
                const user= await fetch('http://34.248.236.103:3000/student?id='+req.session.userId)
                    .then(response => response.json())
                    .then(data => data[0]);
                    if(user){
                        await connexion.execute(`INSERT INTO "User" VALUES (:userName, :email, :firstName,:lastName,:password)`,
                            { userName:user[2], email:user[5], firstName:user[3], lastName:user[4],password: user[2] },{autoCommit: true}).then(

                                async()=>{
                                    const new_user=await connexion.execute(`SELECT * FROM "User" WHERE username=:userId`,{userId:req.session.userId})
                                    await connexion.close()
                                    console.log(new_user)
                                }
                            )

                    }
                    else{
                        console.log("User not found")
                    }
                    
                }
                else{
                    await connexion.close()
                    console.log(result)
                }
                
                
                console.log(req.session)
                res.setHeader('Set-Cookie', `sessionId=${req.session.userId}`);
                console.log(res.header)
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
    

    fetch('http://34.248.236.103:3000/student?id='+req.session.userId).then(response => response.json()).then(data => {console.log(data)});
    
    
    
}  

//check if the user is in the chat database
//else, register it
exports.check_user= async function(req,res){
    const connexion= await oracledb.getConnection(dbConfig)

    const result= await connexion.execute(`SELECT * FROM "User" WHERE username=:userId`,{userId:req.session.userId})
    if(result.rows && result.rows.length==0){
       const user= await fetch('http://34.248.236.103:3000/student?id='+req.session.userId)
        .then(response => response.json())
        .then(data => data[0]);
        if(user){
            await connexion.execute(`INSERT INTO "User" VALUES (:userName, :email, :firstName,:lastName,:password)`,
                { userName:user[2], email:user[5], firstName:user[3], lastName:user[4],password: user[2] },{autoCommit: true}).then(

                    async()=>{
                        const new_user=await connexion.execute(`SELECT * FROM "User" WHERE username=:userId`,{userId:req.session.userId})
                        await connexion.close()
                        res.send(new_user)
                    }
                )

        }
        
    }
    else{
        await connexion.close()
        res.send(result)
    }
    
}

exports.log_out=async function(req,res){

    //destroy the session of the connected user
    req.session.destroy();

    res.send("You are log out")
}