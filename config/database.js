const mongoose = require('mongoose');
require('dotenv').config()

function connectToDatabase(){
    return mongoose.connect(process.env["DB_URL"])
}


module.exports = {connectToDatabase, mongoose}