// an user id
// 63c16c3ad393089e5d87fea4

const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminConstructor = module.require("./Schemas/admins");
const userConstructor = module.require("./Schemas/users");
const serviceConstructor = module.require("./Schemas/services");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const socket=require("socket.io")
const cookieParser = require("cookie-parser");
const morgan=require("morgan")


const userRoutes=require("./Routes/user")
const serviceRoutes=require("./Routes/service")
const wishlistRoutes=require("./Routes/wishlist")
const chatRoutes=require("./Routes/chat")

// app.use(morgan("tiny"));

app.use(cookieParser())
app.use(cors({ origin: true}));

app.use(express.json());
app.use("/user",userRoutes  )
app.use("/service",serviceRoutes)
app.use("/wishlist",wishlistRoutes)
app.use("/chat",chatRoutes)
// app.use("/user/:uid",csrfProtection)


dotenv.config("./.env");
mongoose.set("strictQuery", false);
let port=process.env.port || 5000


const server=app.listen(port, () => {
  console.log(`mongoose server running at port ${port}`);
  mongoose
    .connect(process.env.dbid)
    .then(() => {
      console.log("mongodb connection successful");
     
    })
    .catch((err) => {
      console.log(err);
      console.log("mongodb connection error");
    });
});



//  socket.io code

// * users variable maintains all the active socket connections with key userId
let users={}

function addUser(socketId,userId){
  users[userId]=socketId
}

const io=socket(server,{ cors: {
    origin: ["http://localhost:3000","http://localhost:3001"],
    methods: ["GET", "POST"]
  }})
io.on("connection",(clientSocket)=>{
 
  // io.to(clientSocket).emit("welcome","Server: :) hello u r connected");
  
  clientSocket.on("addUser",(userId)=>{
    addUser(clientSocket.id,userId)
  });
  
  clientSocket.on("sendMessage",(fromUserId,toUserId,Message)=>{
    let toSocketId=users[toUserId]
   // console.log("send Message request to "+toSocketId);
    if(toSocketId){
      clientSocket.to(toSocketId).emit("receiveMessage",fromUserId,toUserId,Message);
    }
  })
  
});


app.get("/", (req, res) => {
  res.send(`server running at port ${port}`);
});

app.get("/profile/:uid", (req,res) => {
  const id = req.params.uid;
  userConstructor
  .find({_id:id})
  .then((result) => {
      res.send(result);
  })
  .catch((err) => {
      res.send(err);
  })
})

app.post("/profile/:uid", (req,res) => {
    const id = req.params.uid;
    
    userConstructor
    .findByIdAndUpdate(id,{fullname: req.body.fullname, $push: {skills: req.body.skills}})
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
      res.send(err);
    })
})

app.get("/admin/users", (req,res) => {
    
    userConstructor
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    })
  })


app.get("/admin/services" , (req,res) => {
  
    serviceConstructor
    .find()
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    })
  })

app.post("/admin/signin", (req, res) => {
//   let data = req.body;
//   let signin = false;
  
//   adminConstructor
//     .find({ email: data.email })
//     .then((result) => {
    
//       let hashnew = bcrypt.hashSync(data.password, 2);
     
//       if (bcrypt.compareSync(data.password, result[0].password)) {
//         res.send(result[0].fullname);
//       } else {
//         res.send("err");
//       }
//     })
//     .catch((err) => {
//       res.send(err);
//     });

  
  
  let data = req.body;
  let signin = false;
  // console.log(data);
  adminConstructor
    .find({ email: data.usnam })
    .then((result) => {
      if(result[0].password === data.eml)
      {
        res.send(result[0]);
      }
      else
      {
        res.send("hello");
      }
     
    })
    .catch((err) => {
      res.send("hell");
    });
});

function userSortComparator(sort,order){
  if(sort==="username" && order==="asc"){
    return {username:1}
  }
  else if(sort==="username" && order==="dsc"){
    return {username:-1}
  }
  else if(sort==="datejoined" && order==="asc"){
    return {createdAt:1}
  }
  else if(sort==="datejoined" && order==="dsc"){
    return {createdAt:-1}
  }
  else{
    return {}
  }
}

app.post("/admin/user/filter",(req,res)=>{
  let data=req.body;
  userConstructor.find(
    {username:
     {
      $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
      $options: "i"
     }
    }
  )
  .sort(userSortComparator(data.sort,data.order))
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    res.send(err)
  })
})


function serviceSortComparator(sort,order){
  if(sort==="title" && order==="asc"){
    return {title:1}
  }
  else if(sort==="title" && order==="asc"){
    return {title:-1}
  }
  else if(sort==="dateposted" && order==="asc"){
    return {createdAt:1}
  }
  else if(sort==="dateposted" && order==="dsc"){
    return {createdAt:-1}
  }
  else if(sort==="price" && order==="asc"){
    return {price:1}
  }
  else if(sort==="price" && order==="dsc"){
    return {price:-1}
  }
  else{
    return {}
  }
}


app.post("/admin/service/filter",(req,res)=>{
  let data=req.body;
  // console.log(data)
  serviceConstructor.find(
    {title:
     {
      $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
      $options: "i"
     }
    }
  )
  .populate("seller")
  .sort(serviceSortComparator(data.sort,data.order))
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    res.send(err)
  })
})


app.get("/test",async (req,res)=>{
  let data=await serviceConstructor.find().populate("seller")
  res.send(data)
})

//* route for filter and pagination

