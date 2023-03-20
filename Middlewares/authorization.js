const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
  //   cookie format
  // {
  //   jwt:jwt_Token_Val
  // }
  const uid=req.params.uid;
  const cookie=req.cookies;
  console.log(cookie);
  const jwtTokenVal=cookie.jwtToken
  if(!jwtTokenVal){
    res.send("auth failed1")  
  }
  else{
    jwt.verify(jwtTokenVal,process.env.secretKey,(err,tokenData)=>{
      if(err){
        res.send("auth failed2");
      }
    
        let userIdInToken=tokenData.id
        if(userIdInToken!==uid){
          res.send("auth failed3");
        }
    })
    next();
  }
  

  
  // this auth middleware should be added to all routes and 
  // it needs to check the cookie for jwt token
  // it verifies the token
  // if the token is not matched
  // it sends a custom message
  // client needs to setup a authcontext to protect the routes 
  // from the sent response of the auth middleware
  
  
}
module.exports=auth;