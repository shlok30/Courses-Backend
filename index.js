const express = require('express')
const bodyParser = require("body-parser")
const adminRouter = require("./routes/admins")
const userRouter = require("./routes/users")
const {connectToDatabase} = require("./config/database")
const app = express()
const port = 3000

async function startServer(){
  try{
    await connectToDatabase()

    console.log("DB Connected")

    app.use(bodyParser.json())
    
    app.use("/admins",adminRouter)
    app.use("/users",userRouter)

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch(e){
    console.log("DB not connected",e)
  }
}

startServer()

