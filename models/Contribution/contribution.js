const mongoose = require('mongoose');
//Set up default mongoose connection

const contributerSchema= mongoose.Schema({
    
    user:{
        type:Number,
        require:true
    },
    repository:{
        type:Number,
        require:true
    },
    line_count:{
        type:Number,
        require:true
    },
})

const Contribution = mongoose.model("Contribution",contributerSchema)

module.exports = Contribution