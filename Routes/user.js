const router=require("express").Router()
const bcrypt = require("bcrypt");
const userConstructor = module.require("../Schemas/users");
const jwt=require("jsonwebtoken")
const auth=require("../Middlewares/authorization")

router.get("/",auth,(req, res) => {
  userConstructor
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/:uid", (req, res) => {
  userConstructor
    .findOne({ _id: req.params.uid })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.post("/update", (req, res) => {
  // * user data update
  const data = req.body;
  const uid = data.uid;

  delete data.uid;

  userConstructor
    .updateOne({ _id: uid }, data)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});


router.get("/temp",(req,res)=>{
  res.send("test")
})







// ------------------------------------------------------
//  chandra's code

router.post("/chandra/signup", (req, res) => {
//   let data = req.body;
//   userConstructor(data)
//     .save()
//     .then((response) => {
//       res.send(true);
// //     * redirect to login page
//     })
//     .catch((err) => {
//       res.send(false);
//     });
  
  console.log("hello")
  const username = req.body.username;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const obj = {
    fullname : fullname,
    username : username,
    email : email,
    password : password
  }
  userConstructor(obj)
    .save()
    .then((response) => {
      res.send(response);
//     * redirect to login page
    })
    .catch((err) => {
      console.log("puk")
      res.send(err);
    });
  
  
});


function createToken(id){
  let payload={
    id:id,
    age:1 * 24 * 60 * 60*2000
  }
  return jwt.sign(payload,process.env.secretKey);
}




router.post("/chandra/signin", (req, res) => {
//   let data = req.body;
//   let signin = false;
//   // console.log(data);
//   userConstructor
//     .find({ email: data.email })
//     .then((result) => {
     
//       if (bcrypt.compareSync(data.password, result[0].password)) {
        
//         let jwtToken=createToken(result[0]._id);
//         res.send(jwtToken);
//         // * user need to set this jwttoken in a cookie in format
//           // {
//           //   jwt:jwt_Token_Val
//           // }
//       } else {
//         res.send("password not matched");
//       }
//     })
//     .catch((err) => {
//       res.send(err);
//     });
  
  
  let data = req.body;
  let signin = false;
  userConstructor
    .find({ email: data.userEmail })
    .then((result) => {
     
      if (bcrypt.compareSync(data.userPassword, result[0].password)) {
        
        let jwtToken=createToken(result[0]._id);
        res.send({result,jwtToken});
        // * user need to set this jwttoken in a cookie in format
          // {
          //   jwt:jwt_Token_Val
          // }
      } else {
        res.json("Password not correct")
        return res;
      }
    })
    .catch((err) => {
      res.json("Email not correct")
        return res;
    });

});




module.exports=router;

