// an user id
// 63c16c3ad393089e5d87fea4

const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminConstructor = module.require("./Schemas/admins");
const userConstructor = module.require("./Schemas/users");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const socket=require("socket.io")
const cookieParser = require("cookie-parser");
const morgan=require("morgan")
const csurf=require("csurf")

const userRoutes=require("./Routes/user")
const serviceRoutes=require("./Routes/service")
const wishlistRoutes=require("./Routes/wishlist")
const chatRoutes=require("./Routes/chat")

// app.use(morgan("tiny"));
const csrf = require("csurf");
let csrfProtection = csrf({ cookie: true });
app.use(cookieParser())
app.use(cors({ origin: true}));

app.use(express.json());
app.use("/user",userRoutes  )
app.use("/service",serviceRoutes)
app.use("/wishlist",wishlistRoutes)
app.use("/chat",chatRoutes)



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


//* route for filter and pagination

app.get("/csrf",csrfProtection,(req,res)=>{
 res.send("csrf token is"+req.csrfToken());
})

app.post("/csrf",csrfProtection,(req,res)=>{
  res.send("in post req")
})