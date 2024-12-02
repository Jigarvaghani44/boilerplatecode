const Redis = require('ioredis');
const Joi = require('joi')
// Create Redis clients
const redisClient = new Redis();
const triggerRoutes = {
    method: 'POST',
    path: '/api/v1/trigger',
    handler: async (request, h) => {
     
       
        const query = request.payload; // Example: { "query": "Node.js" }
        console.log(query);
        
        await redisClient.publish('fetch_repositories', JSON.stringify({ query }));
        return h.response({ message: 'Trigger sent to fetch repositories.' }).code(200);
    },
    options: {
        description: 'Trigger a fetch for repositories',
        notes: 'Publishes a message to the Redis channel to initiate fetching of repositories based on the provided query.',
        tags: ['api', 'trigger'],
        validate: {
            payload: Joi.object({
                q: Joi.string()
                    .required()
                    .description('The query string to fetch repositories for. Example: "Node.js"'),
                per_page:Joi.number().optional(),
                page:Joi.number().optional()
            }).required(),
        },
    }
    
}

module.exports = triggerRoutes