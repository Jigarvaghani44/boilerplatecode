const isShuttingDown = false;
const Redis = require('ioredis');
const mongoose  = require("mongoose");
const redisClient = new Redis();
const Joi = require('joi');
const healthCheckRoute = {
    method: 'GET',
    path: '/healthz',
    handler: async (request, h) => {
      if (isShuttingDown) {
        return h.response({ status: 'shutting down' }).code(503);
      }
      try {
        await checkMongoHealth();
        await checkRedisHealth();
        return h.response({ status: 'ok' }).code(200);
      } catch (err) {
        console.error('Health check failed:', err);
        return h.response({ status: 'error', message: err.message }).code(500);
      }
    },
    options: {
        description: 'Health check',
        notes: 'Checks if MongoDB and Redis are available.',
        tags: ['api'],
        validate: {
            // Example of a query validation schema if needed
            query: Joi.object({
              timeout: Joi.number().optional(),
            }),
          },
      },
  }
  async function checkMongoHealth() {
    const timeout = Number(process.env.PG_HEALTH_CHECK_TIMEOUT) || 2000;
    const healthCheckPromise = mongoose.connection.db.admin().ping();
    return Promise.race([
      healthCheckPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('MongoDB health check timeout')), timeout)),
    ]);
  }
  async function checkRedisHealth() {
    const ping = await redisClient.ping();
    if (ping !== 'PONG') {
      throw new Error('Redis health check failed');
    }
  }
  module.exports=healthCheckRoute