const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");


router.get("/coversation/:uid",(req,res)=>{
  conversationConstructor.find({})
});

router.get("/message/:conversationId",(req,res)=>{
  
});

router.post("/message/add",(req,res)=>{
//   body contains two user id's and messages
  const data=req.body.data;
  
});

router.post("/conversation/add",(req,res)=>{
  const data=req.body.data;
});

module.exports=router;