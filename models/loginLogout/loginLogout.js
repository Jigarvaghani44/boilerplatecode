const mongoose = require('mongoose');
//Set up default mongoose connection

const loginlogoutSchema= mongoose.Schema({
    
    email:{
        type:String,
        require:true,
       
    },
    password:{
        type:String,
        require:true
    }
})

const Loginlogout = mongoose.model("Loginlogout",loginlogoutSchema)

module.exports = Loginlogout