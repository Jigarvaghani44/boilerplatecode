const Redis = require("ioredis");

const redisClient = new Redis();

module.exports = {
  async healthCheck() {
    return redisClient.ping();
  },
  async destroy() {
    await redisClient.quit();
  },
};