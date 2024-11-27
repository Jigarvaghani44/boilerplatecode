const Repository = require("../models/Repository/repository")

const repoRoutes = [   {
    method: 'GET',
    path: '/repo/{id}',
    handler: async (request, h) => {
        let id = request.params.id;
        console.log(id);
        let res = await Repository.find({id})
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


