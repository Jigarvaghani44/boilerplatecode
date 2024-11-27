const mongoose = require('mongoose');
//Set up default mongoose connection

const contributerSchema= mongoose.Schema({
    
    user:{
        type:Object,
        require:true
    },
    repository:{
        type:Object,
        require:true
    },
    line_count:{
        type:Number,
        require:true
    },
    id:{
        type:Number,
        require:true,
        unique:true
    }
})

const Contribution = mongoose.model("Contribution",contributerSchema)

module.exports = Contribution