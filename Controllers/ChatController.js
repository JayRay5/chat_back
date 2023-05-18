//import
const oracledb = require('oracledb');

const session = require('express-session');
const fetch = require("node-fetch");

const dbConfig= require('../db_config');

exports.get_chats=async function(req,res){
    if(req.session.chatId){
        delete req.session.chatId
    }
    const connexion= await oracledb.getConnection(dbConfig)

    const result= await connexion.execute(`SELECT "CHATROOM".*
    FROM "DISCUSSVIA"
    JOIN "User"  ON "DISCUSSVIA".username = "User".username
    JOIN "CHATROOM" ON "DISCUSSVIA".chat_id = "CHATROOM".chat_id
    WHERE "DISCUSSVIA".username=:userId`,{userId:req.session.userId})
    connexion.close()
    res.send(result)


}

//allows to the user to create a chat
exports.create_chat=async function(req,res){

    const connexion= await oracledb.getConnection(dbConfig)

    const result= await connexion.execute(`INSERT INTO "CHATROOM" VALUES (sequencechat.nextval, :name, :userId) 
    RETURNING chat_id INTO :chat_id`,
    {   name:req.body.name, 
        userId:req.session.userId,
        chat_id:{ 
            type:oracledb.NUMBER,
            dir: oracledb.BIND_OUT}
      },{autoCommit: true})

    await connexion.execute(`INSERT INTO "DISCUSSVIA" VALUES (:userName, :chat_id)`,
    {   userName:req.session.userId,
        chat_id:result.outBinds.chat_id[0]
      },{autoCommit: true})

    if(req.body.userId){
      await connexion.execute(`INSERT INTO "DISCUSSVIA" VALUES (:userName, :chat_id)`,
      {   userName:req.body.userId,
          chat_id:result.outBinds.chat_id[0]
        },{autoCommit: true})
    }

    connexion.close()
    res.send(result.outBinds.chat_id)


}

exports.add_user_to_chat=async function(req,res){
    console.log("add user",req.body.userId)
    const connexion= await oracledb.getConnection(dbConfig)
    
    try{
        const result= await connexion.execute(`INSERT INTO "DISCUSSVIA" VALUES (:userName, :chat_id)`,
        {   userName:req.body.userId, 
            chat_id:req.session.chatId
        },{autoCommit: true})
        console.log(result)
        connexion.close()
        res.send(result)
    
    }
    catch(err){
        console.log(err)
        connexion.close()
        res.send("Impossible operation")
        
    }
      


}

exports.get_chat=async function(req,res){
    console.log("get chat")
    if(req.params.chatId){
        const connexion= await oracledb.getConnection(dbConfig)

        const result= await connexion.execute(`SELECT *
        FROM "DISCUSSVIA"
        JOIN "User"  ON "DISCUSSVIA".username = "User".username
        JOIN "CHATROOM" ON "DISCUSSVIA".chat_id = "CHATROOM".chat_id
        FULL JOIN "MESSAGE" ON  "CHATROOM".chat_id= "MESSAGE".chat_id AND "User".username = "MESSAGE".username
        FULL JOIN "TEXT" ON "MESSAGE".message_id= "TEXT".message_id
        WHERE "CHATROOM".chat_id=:chatId`,{chatId:req.params.chatId})

        req.session.chatId=req.params.chatId
        const rows = result.rows;
        const jsonResult = rows.map(row => Object.assign({}, ...row.map((value, index) => ({ [result.metaData[index].name]: value }))));

        connexion.close();
        res.json(jsonResult);
    }
    else{
        res.send("Impossible to complete the task!")
    }


}

exports.delete_chat=async function(req,res){
    console.log("delete chat")
    if(req.params.chatId){
        const connexion= await oracledb.getConnection(dbConfig)
        console.log(req.params.chatId)
        await connexion.execute(
            `DELETE FROM "TEXT" WHERE message_id IN (SELECT "MESSAGE".message_id FROM "MESSAGE" WHERE chat_id = :chatId)`,
            {chatId:req.params.chatId},
            {autoCommit: true})

        await connexion.execute(
            `DELETE FROM "MESSAGE" WHERE "MESSAGE".chat_id=:chatId `,
            {chatId:req.params.chatId},
            {autoCommit: true})

        await connexion.execute(
            `DELETE FROM "DISCUSSVIA" WHERE "DISCUSSVIA".chat_id=:chatId`,
            {chatId:req.params.chatId},
            {autoCommit: true})

        await connexion.execute(
            `DELETE FROM "CHATROOM" WHERE "CHATROOM".chat_id=:chatId`,
            {chatId:req.params.chatId},
            {autoCommit: true})
        connexion.close()
        res.send("")
    }
    else{
        res.send("Impossible to complete the task!")
    }


}

exports.write_message=async function(req,res){
    console.log(req.body)
    const connexion= await oracledb.getConnection(dbConfig)

    const result= await connexion.execute(`INSERT INTO "MESSAGE" VALUES (sequencemessage.nextval,TO_DATE(:datet, 'YYYY-MM-DD HH24:MI:SS'), :userNamet, :chat_idt)
    RETURNING message_id INTO :message_id`,
    {  
         datet:new Date().toISOString().replace(/[TZ]/g, ' ').replace(/\..*/, ''),
         userNamet:req.session.userId, 
         chat_idt:req.session.chatId,//req.body.chatId
         message_id:{ 
            type:oracledb.NUMBER,
            dir: oracledb.BIND_OUT}
      },{autoCommit: true})
      console.log(result.outBinds.message_id[0])
    await connexion.execute(`INSERT INTO "TEXT" VALUES (:message_id,:message_value)`,
    {   message_id:result.outBinds.message_id[0],
        message_value:req.body.messageValue
    },{autoCommit: true})
    connexion.close()
    res.send(result)


}