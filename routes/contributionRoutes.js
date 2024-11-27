const Contribution = require("../models/Contribution/contribution") 
const User = require('../models/User/user')
const Repository = require("../models/Repository/repository")
const contributionRoutes =[   {
    method: 'GET',
    path: '/contri/{id}',
    handler: async (request, h) => {
        let id = request.params.id;
        console.log(id);
        let res = await Contribution.find({id})
        return { res };
    },
},
{
    method: 'POST',
    path: '/contri-insert',
    handler: async (request, h) => {
       
        const id = request.payload.id
        const line_count =request.payload.line_count
        const user = await User.find({id})
        console.log(user);
        
        
        const repository = await Repository.find({id})
        console.log(repository);
       const data = {
        user,repository,id,line_count
       }
       console.log(data);
       
       const res = await Contribution.insertMany(data)
        return { message: 'User created', data: res };
    },
}
]
module.exports = contributionRoutes;