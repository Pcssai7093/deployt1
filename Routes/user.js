const router=require("express").Router()
const bcrypt = require("bcrypt");
const userConstructor = module.require("../Schemas/users");
const jwt=require("jsonwebtoken")


function createToken(id){
  let payload={
    id:id,
    age:1 * 24 * 60 * 60*2000
  }
  return jwt.sign(payload,process.env.secretKey);
}

router.post("/signin", (req, res) => {
  let data = req.body;
  let signin = false;
  // console.log(data);
  userConstructor
    .find({ email: data.email })
    .then((result) => {
     
      if (bcrypt.compareSync(data.password, result[0].password)) {
        
        let jwtToken=createToken(result[0]._id);
        res.send(jwtToken);
      } else {
        res.send("err");
      }
    })
    .catch((err) => {
      res.send(err);
    });

});

router.post("/signup", (req, res) => {
  let data = req.body;
  userConstructor(data)
    .save()
    .then((response) => {
      // console.log(response);
      res.send(response._id);
      // res.send(response);
    })
    .catch((err) => {
      // console.log(err);
      // * handle errors by parsing this err object
      res.send(err);
    });
});

router.get("/temp",)
module.exports=router;

