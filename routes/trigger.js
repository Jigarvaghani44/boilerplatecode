const Redis = require('ioredis');

// Create Redis clients
const redisClient = new Redis();
const triggerRoutes = {
    method: 'POST',
    path: '/trigger',
    handler: async (request, h) => {
        const query = request.payload; // Example: { "query": "Node.js" }
        console.log(query);
        
        await redisClient.publish('fetch_repositories', JSON.stringify({ query }));
        return h.response({ message: 'Trigger sent to fetch repositories.' }).code(200);
    },
}

module.exports = triggerRoutes