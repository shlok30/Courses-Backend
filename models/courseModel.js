const {mongoose} = require("../config/database")

const courseSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description: {type : String, required : true},
    price: {type : Number, required : true},
    imageLink: {type : String, required : true},
    published: {type : Boolean, required : true}
})

const Course = mongoose.model("Course",courseSchema)

module.exports = Course

