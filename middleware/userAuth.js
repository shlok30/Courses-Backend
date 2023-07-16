const jwt = require("jsonwebtoken")
const userSecretKey = process.env['USER_SECRET_KEY']

function userAuth(req,res,next){
  const {auth} = req.headers
  const token = auth.split(" ")[1]
  try{
    const verifiedPayload = jwt.verify(token,userSecretKey)
    if(verifiedPayload){
      req.username = verifiedPayload.username
      next()
    }
  }
  catch(e){
    res.status(401).json({error : "Not Authorized"})
  }
}

module.exports = userAuth