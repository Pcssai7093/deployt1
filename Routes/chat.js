const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");


router.get("/coversation/:uid",(req,res)=>{
  let uid=req.params.uid
  conversationConstructor.find({$or:[{user1:uid},{user2:uid}]})
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});

router.get("/message/:conversationId",(req,res)=>{
  let cid=req.params.conversationId
  conversationConstructor.find({_id:cid})
  .populate("messages")
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});

router.post("/message/add",(req,res)=>{
//   body contains two user id's and messages
  const data=req.body.data;
  
});

router.post("/conversation/add",(req,res)=>{
  const data=req.body.data;
  const uid1=data.user1;
  const uid2=data.user2;
  conversationConstructor.find({$or:
                                [
                                  {user1:uid1,user2:uid2},
                                  {user1:uid2,user2:uid1}
                                ]
                               })
    .then((result)=>{
      
    if(result.length==0){
        conversationConstructor(data)
        .save()
        .then((result)=>{
          res.send(result);
        })
        .catch((err)=>{
          res.send("error")
        })
    }
    else{
      res.send("conversation already exists")
    }
    
  })
});

module.exports=router;