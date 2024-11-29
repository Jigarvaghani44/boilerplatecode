const User = require('../models/User/user')
const Joi = require("joi")

const userRoutes = [   {
    method: 'GET',
    path: '/users/{id}',
    handler: async (request, h) => {
        let _id = request.params.id;
        console.log(_id);
        let res = await User.find({_id})
        return { message: 'List of users', res };
    },
    options: {
        description: 'Get user by ID',
        notes: 'Returns a single user based on the provided user ID',
        tags: ['api', 'users'],
        validate: {
            params: Joi.object({
                id: Joi.string().required().description('The ID of the user')
            })
        },
        
    }
},
{
    method: 'POST',
    path: '/user-insert',
    handler: async (request, h) => {
        const payload = request.payload;
        await User.insertMany(payload)
        return { message: 'User created', data: payload };
    },
    options: {
        description: 'Create a new user',
        notes: 'Inserts new user(s) into the system',
        tags: ['api', 'users'],
        validate: {
            payload: Joi.array().items(Joi.object({
                id: Joi.number().required(),
                login: Joi.string().required(),
                avatar_url: Joi.string().required(),
                html_url: Joi.string().required(),
                type: Joi.string().required(),
                contributions: Joi.number().required()
                // You can add more fields like phone, address, etc.
            })).required()
        },
        
    }

},

]
module.exports = userRoutes;