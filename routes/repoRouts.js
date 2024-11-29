const Joi = require("joi")
const Repository = require("../models/Repository/repository")
const Contribution = require("../models/Contribution/contribution")
const repoRoutes = [
    {
        method: 'GET',
        path: '/api/v1/repo/{full_name}',
        handler: async (request, h) => {
            let full_name = request.params.full_name;
            console.log(full_name);
            
            let res = await Repository.find({full_name})
            return { message: 'List of users', res };
        },
        options: {
            description: 'Get a repository by full name',
            notes: 'Returns a list of users from the specified repository',
            tags: ['api', 'repository'], // Tags for grouping in Swagger UI
            validate: {
                params:Joi.object({
                    full_name: Joi.string().required().description('The full name of the repository')
                })
            },
            response: {
                status: {
                    200: Joi.object({
                        message: Joi.string(),
                        res: Joi.array().items(Joi.object()) // Define the structure of response data
                    })
                }
            }
        }
    },

{
    method: 'POST',
    path: '/repo-insert',
  
    handler: async (request, h) => {
        const payload = request.payload;
        console.log(payload);
        try{
            await Repository.insertMany(payload)
        return { message: 'User created', data: payload };
        }
        catch(err){
          return  console.log(err);
            
        }
        
    },
    options: {
        description: 'Insert new repository records',
        notes: 'Creates new repositories from the provided data',
        tags: ['api', 'repository'],
        validate: {
            payload:
                Joi.object({ 
                    id: Joi.number().required(),
                    owner: Joi.object().required(),
                    full_name: Joi.string().required(),
                    description: Joi.string().required(),
                    html_url: Joi.string().required(),
                    language: Joi.string().required(),
                    stargazers_count: Joi.number().required()
                    // Add other fields for the Repository model if needed
                })
            
        },
        // response: {
        //     status: {
        //         200: Joi.object({
        //             message: Joi.string(),
        //             data: Joi.array().items(Joi.object())
        //         })
        //     }
        // }
    }
},
{
    method: 'GET',
    path: '/api/repo/{id}/contributions',
    handler: async (request, h) => {
        let id = request.params.id;
        try {
            const contributions = await Contribution.find({repository:id});
            if (!contributions.length) {
              return h.response({ error: 'No contributions found' }).code(404);
            }
            return h.response(contributions).code(200);
          } catch (error) {
            console.error('Error fetching contributions:', error);
            return h.response({ error: 'Internal Server Error' }).code(500);
          }
    },
    options: {
        description: 'Get contributions for a repository',
        notes: 'Returns all contributions made to a specific repository',
        tags: ['api', 'contributions'],
        validate: {
            params:Joi.object({
                id: Joi.number().required().description('The ID of the repository')
            })
           
        },
        response: {
            status: {
                200: Joi.array().items(Joi.object()), // Define structure of contributions
                404: Joi.object({
                    error: Joi.string().default('No contributions found')
                }),
                500: Joi.object({
                    error: Joi.string().default('Internal Server Error')
                })
            }
        }
    }
},

]
module.exports = repoRoutes;
