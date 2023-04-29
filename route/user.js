var express=require("express");
var router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


var controller=require("../Controllers/UserController");



router.get("/",authMiddleware,controller.get_users);
router.get("/login",controller.authentification)
router.get("/profil",authMiddleware,controller.get_profil)
router.get("/logout",authMiddleware,controller.log_out)

module.exports=router;