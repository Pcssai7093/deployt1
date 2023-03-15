const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");


router.get("/coversations/:uid",(req,res)=>{
  
});

router.get("/messages/:uid1/:uid2",(req,res)=>{
  
});

module.exports=router;