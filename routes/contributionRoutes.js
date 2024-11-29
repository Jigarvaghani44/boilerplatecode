const Contribution = require("../models/Contribution/contribution");
const Joi = require("joi");

const contributionRoutes = [
  // GET /contri/{id}
  {
    method: "GET",
    path: "/contri/{id}",
    handler: async (request, h) => {
      const _id = request.params.id;

      try {
        const res = await Contribution.find({ _id });
        if (!res || res.length === 0) {
          return h.response({ message: "Contribution not found" }).code(404);
        }
        return h.response({ data: res }).code(200);
      } catch (error) {
        console.error("Error fetching contributions:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
    options: {
      description: "Get a contribution by ID",
      tags: ["api", "contributions"],
      validate: {
        params: Joi.object({
          id: Joi.string().required().description("The contribution ID"),
        }),
      },
    },
  },

  // POST /contri-insert
  {
    method: "POST",
    path: "/contri-insert",
    options: {
      handler: async (request, h) => {
        const data = request.payload;
        console.log(data);

        try {
          const res = await Contribution.insertMany(data);
          return h
            .response({ message: "Contributions created", data: res })
            .code(201);
        } catch (error) {
          console.error("Error inserting contributions:", error);
          return h
            .response({ error: "Failed to insert contributions" })
            .code(500);
        }
      },

      description: "Insert contributions",
      tags: ["api", "contributions"],
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
          line_count: Joi.number().required(),
          user: Joi.number().required(),
          repository: Joi.number().required(),
        }),
      },
    },
  },
];

module.exports = contributionRoutes;

// const contributionRoutes =[   {
//     method: 'GET',
//     path: '/contri/{id}',
//     handler: async (request, h) => {
//         let _id = request.params.id;
//         console.log(id);
//         let res = await Contribution.find({_id})
//         return { res };
//     },
// },

// {
//     method: 'POST',
//     path: '/contri-insert',
//     handler: async (request, h) => {

//         // const id = request.payload.id
//         // const line_count =request.payload.line_count
//         // const user = await User.find({id})
//         // console.log(user);

//         // const repository = await Repository.find({id})
//         // console.log(repository);
//     //    const data = {
//     //     user,repository,id,line_count
//     //    }
//     //    console.log(data);
//      try{  let data = request.payload;
//         console.log(data);

//        const res = await Contribution.insertMany(data)
//         return { message: 'User created', data: res };}
//         catch(err){
//            return console.log(err);

//         }
//     },
// }
// ]
// module.exports = contributionRoutes;
