//import
var express=require("express");
var router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


var controller=require("../Controllers/UserController");



router.get("/all",controller.get_users);
router.post("/login",controller.authentification)
router.get("/check_user",authMiddleware,controller.check_user)
router.get("/profil",authMiddleware,controller.get_profil)
router.get("/logout",authMiddleware,controller.log_out)

module.exports=router; 