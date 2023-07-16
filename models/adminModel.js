const {mongoose} = require("../config/database")

const adminSchema = new mongoose.Schema({
    username : {type : String, required : true},
    password : {type : String, required : true}
})

const Admin = mongoose.model("Admin",adminSchema)

module.exports = Admin