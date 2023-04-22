const router=require("express").Router()
const messageConstructor = module.require("../Schemas/message");
const conversationConstructor = module.require("../Schemas/conversation");
const userConstructor = module.require("../Schemas/users");

router.get("/temp",(req,res)=>{
  res.send("chat temp");
});

/**
 * @swagger
 *  components:
 *      schema:
 *          Message:
 *            type: object
 *            properties:
 *                users:
 *                    type: object
 *                messages:
 *                    type: object
 *                
 */

/**
 * @swagger
 *  components:
 *      schema:
 *          Conversation:
 *            type: object
 *            properties:
 *                users:
 *                    type: object
 *                messages:
 *                    type: object
 *                
 */

/**
 * @swagger
 * /chat/conversation/{uid}:
 *   get: 
 *        summary: To get the chat between the user and all other persons
 *        description: This API gets the chat between the user and all other persons
 *        parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the chat between the user and all other persons from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Conversation'
 */
  router.get("/conversation/:uid",(req,res)=>{
  let uid=req.params.uid
  
  conversationConstructor.find({users:uid})
  .populate("users","fullname")
  .sort({updatedAt:-1})
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
  
});


/**
 * @swagger
 * /chat/message/{conversationId}:
 *   get: 
 *        summary: To get the chat between two people
 *        description: This API gets the chat between two people
 *        parameters:
 *            - in: path
 *              name: conversationId
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the chat between two people from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Conversation'
 */

router.get("/message/:conversationId",(req,res)=>{
  let cid=req.params.conversationId
  conversationConstructor.find({_id:cid})
  .populate("messages",["message","from","createdAt"])
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    res.send("error")
  })
});


// adding messages in a conversation

/**
 * @swagger
 * /chat/message/add:
 *  post:
 *      summary: To add a message between two users
 *      description: To add a message between two users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          from: 
 *                              type: string
 *                          to:
 *                              type: string
 *                          message:
 *                              type: string
 *      responses:
 *          200:
 *              description: To add a message between two users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              from:
 *                                  type: string
 *                              to:
 *                                  type: string
 *                              seen:
 *                                  type: boolean
 *                          
 */

router.post("/message/add",(req,res)=>{
  // no conversation id is needed
//   body contains two user id's and messages
//   conversationId
  const cid=req.params.cid
  const data=req.body;
//   data obj format
  // {
  //   from:uid1
  //   to:uid2
  //   message:"msg"
  // }
  messageConstructor(data)
    .save()
    .then((result)=>{

    res.send(result)
  })
    .catch((err)=>{
    res.send(err)
  })
  
});


// adding adding conversation for users

/**
 * @swagger
 * /chat/conversation/add:
 *  post:
 *      summary: To add a message between two users
 *      description: To add a message between two users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user1: 
 *                              type: string
 *                          user2:
 *                              type: string
 *      responses:
 *          200:
 *              description: To add a message between two users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              users:
 *                                  type: array
 *                              messages:
 *                                  type: array
 *                          
 */

router.post("/conversation/add",(req,res)=>{
  // res.send("hello");
  const data=req.body;
  //   data obj format
  // {
  //   user1:uid1
  //   user2:uid2
  // }
  const uid1=data.user1;
  const uid2=data.user2;
  if(uid1!==uid2){
    conversationConstructor.find({$and:
                                [
                                  {users:uid1},
                                  {users:uid2}
                                ]
                               })
    .then((result)=>{
      
    if(result.length==0){
        conversationConstructor({users:[uid1,uid2]})
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
  .catch((err)=>{
    res.send("err2")
  })
  } 
  else{
    res.send("same user");
  }
    
});

/**
 * @swagger
 * /chat/countUnseen/{uid}:
 *   get: 
 *        summary: To get the number of unseen messages
 *        description: This API gets the number of unseen messages
 *        parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the number of unseen messages from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: number
 */


router.get("/countUnseen/:uid",async (req,res)=>{
  const uid=req.params.uid;
  messageConstructor.find({to:uid,seen:false}).count()
  .then((result)=>{
    res.send({count:result})
  })
  .catch((err)=>{
    res.send(err)
  })
  // console.log(count);
  // res.send({count});
})

/**
 * @swagger
 * /chat/updateSeen/{fromUId}/{toUid}:
 *   get: 
 *        summary: To get the number of unseen messages
 *        description: This API gets the number of unseen messages
 *        parameters:
 *            - in: path
 *              name: fromUId
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *            - in: path
 *              name: toUid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the number of unseen messages from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              acknowledged:
 *                                  type: boolean
 *                              modifiedCount:
 *                                  type: number
 *                              upsertedId:
 *                                  type: string
 *                              upsertedCount:
 *                                  type: number
 *                              matchedCount:
 *                                  type: number
 */                                 


router.get("/updateSeen/:fromUId/:toUid",(req,res)=>{
  const from=req.params.fromUId;
  const to=req.params.toUid;
  // console.log(from,to);
  messageConstructor.updateMany({from:from,to:to},{seen:true})
  .then((result)=>{
    // console.log(result);
    res.send(result);
  })
  .catch((err)=>{
    res.send(err);
  })
})

module.exports=router;