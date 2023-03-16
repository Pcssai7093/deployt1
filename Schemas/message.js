const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const conversationConstructor = module.require("../Schemas/conversation");

const messageSchema=new schema(
{
   message:{
     type:String,
     required:true,
   },
  from:{
    type:schema.Types.ObjectId,
    required:true
  },
  to:{
    type:schema.Types.ObjectId,
    required:true
  }
},
{ timestamps: true });


messageSchema.pre('save',async function(next){
  let update = { $push: { messages: [this._id] } };
    conversationConstructor.updateOne({$and:
                                [
                                  {users:[this.from,this.to]}
                                ]
                               },update)
    .then((result2)=>{
      // res.send(result2);
    })
    .catch((err)=>{
      console.log(err)
    })
  next();
})

const messageConstructor=mongoose.model("messages",messageSchema)
module.exports = messageConstructor;