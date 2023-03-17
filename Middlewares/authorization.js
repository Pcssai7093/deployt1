const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
  //   cookie format
  // {
  //   jwt:jwt_Token_Val
  // }
  const =
  console.log(req.cookies)
  next();

  
  // this auth middleware should be added to all routes and 
  // it needs to check the cookie for jwt token
  // it verifies the token
  // if the token is not matched
  // it sends a custom message
  // client needs to setup a authcontext to protect the routes 
  // from the sent response of the auth middleware
  
  
}
module.exports=auth;