const jwt = require("jsonwebtoken")
const adminSecretKey = process.env['ADMIN_SECRET_KEY']

function adminAuth(req,res,next){
  const {auth} = req.headers
  const token = auth.split(" ")[1]
  try{
    const verifiedPayload = jwt.verify(token,adminSecretKey)
    if(verifiedPayload){
      req.userId = verifiedPayload
      next()
    }
  }
  catch(e){
    res.status(401).json({error : "Not Authorized"})
  }
}

module.exports = adminAuth