const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String, //dataType
        required:true, //validate
    },
    gmail:{
        type:String, //dataType
        required:true, //validate
    },
    address:{
        type:String, //dataType
        required:true, //validate
    },
    phone:{
        type:Number, //dataType
        required:true, //validate
    }, 
});

module.exports = mongoose.model(
    "User",//file name
    userSchema //function name
)