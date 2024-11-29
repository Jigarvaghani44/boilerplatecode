const mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost:27017/github").then(
    console.log("databage is connected successfully")   
)
.catch((err)=>{
    console.log(err);
    
})

module.exports = {
    async healthCheck() {
      const timeout = Number(process.env.PG_HEALTH_CHECK_TIMEOUT) || 2000;
      const healthCheckPromise = mongoose.connection.db.admin().ping();
      return Promise.race([
        healthCheckPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), timeout)),
      ]);
    },
    async close() {
      await mongoose.connection.close();
    },
  };