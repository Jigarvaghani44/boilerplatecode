const User = require('../models/User/user')


const userRoutes = [   {
    method: 'GET',
    path: '/users/{id}',
    handler: async (request, h) => {
        let id = request.params.id;
        console.log(id);
        let res = await User.find({id})
        return { message: 'List of users', res };
    },
},
{
    method: 'POST',
    path: '/user-insert',
    handler: async (request, h) => {
        const payload = request.payload;
        await User.insertMany(payload)
        return { message: 'User created', data: payload };
    },
}
]
module.exports = userRoutes;