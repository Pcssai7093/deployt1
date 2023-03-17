const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
  //   cookie format
  // {
  //   jwt:jwt_Token_Val
  // }
  const cookie=req.cookies;
  const jwtTokenVal=cookie.jwt
  jwt.verify(jwtTokenVal,process.env.secretKey,(err,tokenData)=>{
    console.log("user is valied")
  })
  
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