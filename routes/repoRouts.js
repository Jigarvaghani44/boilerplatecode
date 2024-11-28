const Repository = require("../models/Repository/repository")

const repoRoutes = [   {
    method: 'GET',
    path: '/repo/{full_name}',
    handler: async (request, h) => {
        let full_name = request.params.full_name;
        console.log(full_name);
        let res = await Repository.find({full_name})
        return { message: 'List of users', res };
    },
},
{
    method: 'POST',
    path: '/repo-insert',
    handler: async (request, h) => {
        const payload = request.payload;
        await Repository.insertMany(payload)
        return { message: 'User created', data: payload };
    },
}
]
module.exports = repoRoutes;


