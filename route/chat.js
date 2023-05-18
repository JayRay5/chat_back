//import
var express=require("express");
var router=express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


var controller=require("../Controllers/ChatController");



router.get("/all",authMiddleware,controller.get_chats);
router.get("/:chatId",authMiddleware,controller.get_chat);
router.post("/new",authMiddleware,controller.create_chat);
router.post("/chat/add_user",authMiddleware,controller.add_user_to_chat)
router.post("/chat/new_message",authMiddleware,controller.write_message)
router.delete("/delete/:chatId",authMiddleware,controller.delete_chat)





module.exports=router;