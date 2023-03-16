const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const conversationSchema=new schema(
  {
    users:{
      type:[schema.Types.ObjectId],
      ref:"users"
    },
    messages:{
      type:[schema.Types.ObjectId],
      ref:"messages"
    }
  },
  { timestamps: true });

const conversationConstructor=mongoose.model("conversations",conversationSchema);
module.exports=conversationConstructor;