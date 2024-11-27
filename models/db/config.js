const mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost:27017/github").then(
    console.log("databage is connected successfully")   
)
.catch((err)=>{
    console.log(err);
    
})