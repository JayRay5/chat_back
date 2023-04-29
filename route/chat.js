var express=require("express");
var router=express.Router();

var controller=require("../Controllers/UserController");



router.get("/",function(req,res){

    res.send("Bienvenu")
});



module.exports=router;