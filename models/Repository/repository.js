const mongoose = require('mongoose');
//Set up default mongoose connection

const repositorySchema= mongoose.Schema({
    
    id:{
        type:Number,
        require:true,
       
    },
    owner:{
        type:Object,
        require:true
    },
    full_name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    html_url:{
        type:String,
        require:true
    },
    language:{
        type:String,
        require:true
    },
    stargazers_count:{
        type:Number,
        require:true
    },
})

const Repository = mongoose.model("Repository",repositorySchema)

module.exports = Repository