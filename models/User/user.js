const mongoose = require('mongoose');
//Set up default mongoose connection

const userSchema= mongoose.Schema({
    
    id:{
        type:Number,
        require:true
    },
    login:{
        type:String,
        require:true
    },
    avatar_url:{
        type:String,
        require:true
    },
    html_url:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    
})

const User = mongoose.model("User",userSchema)

module.exports = User