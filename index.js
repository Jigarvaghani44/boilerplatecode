require("dotenv").config();

require("./models/db/config");
const util = require("util");
const triggerRoute = require("./routes/trigger");
const client = require("./elasticSearch");
const port = process.env.PORT;
const cluster = require("cluster");
const os = require("os");
const Hapi = require("@hapi/hapi");
const moment = require("moment");
// console.log(port);
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const logger = require("./logger");
const morgan = require("morgan");
const Joi = require("joi")
const morganFormat = ":method :url :status :response-time ms ";
const userRoutes = require("./routes/userRouts");
const repoRoutes = require("./routes/repoRouts");
const contributionRoutes = require("./routes/contributionRoutes");
const healthCheckRout = require("./routes/healthCheckRout");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Package = require("./package.json");
const loginlogoutRoutes = require("./routes/loginlogoutRoutes")

// Graceful shutdown
async function gracefulShutdown() {
  isShuttingDown = true;
  console.log("Received SIGTERM. Shutting down...");

  const closeServer = util.promisify(server.stop.bind(server));

  try {
    await closeServer();
    await mongoose.connection.close();
    await redisClient.quit();
    console.log("Graceful shutdown completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

const init = async () => {
  const server = Hapi.server({
    port: port,
    host: "localhost",
  });

    //  Register JWT plugin
     await server.register(Jwt);
  
    //  JWT authentication strategy
     server.auth.strategy('jwt', 'jwt', {
         keys: process.env.SECRETE_ID, // Replace with a strong secret key
         verify: {
             aud: false,
             iss: false,
             sub: false,
             nbf: true,
             exp: true,
            
         },
         validate: (artifacts, request, h) => {
          // Additional validation if needed
          return { isValid: true, credentials: { userId: artifacts.decoded.payload.userId } };
      },
     });
 
     // Set default authentication strategy
     server.auth.default('jwt');

     await server.route(loginlogoutRoutes);  
  await server.route(userRoutes);
  await server.route(repoRoutes);
  await server.route(contributionRoutes);
  await server.route(triggerRoute);
  await server.route(healthCheckRout);
  
  await server.ext("onRequest", (request, h) => {
    const morganMiddleware = morgan(morganFormat, {
      stream: {
        write: (message) => {
          // Parse Morgan Log Message
          const [method, url, status, responseTime] = message.trim().split(" ");
          // const now = new Date();
          const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
          const logObject = {
            timestamp,
            method,
            url,
            status: parseInt(status, 10),
            responseTime: parseFloat(responseTime),
          };
          // Log with Winston
          logger.info(logObject);
        },
      },
    });

    // Call Morgan Middleware
    morganMiddleware(request.raw.req, request.raw.res, () => {});
    return h.continue;
  });

  const swaggerOptions = {
    info: {
      title: "API Documentation",
      version: Package.version,
      description: "This is the API documentation for our application.",
    },
    tags: [
      {
        name: "users", // Example tag for grouping endpoints
        description: "User-related operations",
      },
      {
        name: "repositories",
        description: "Repository-related operations",
      },
    ],
    grouping: "tags", // Group endpoints by tags
    documentationPath: "/docs", // Path for the Swagger UI
    securityDefinitions: {
      Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Bearer authentication for JWT tokens',
      },
  },
  security: [
      {
          Bearer: [],
      },
  ],
  };

  // Register Plugins
  const registerPlugins = async () => {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);
  };


  server.route({
    method: "GET",
    path: "/hello",
    options: {
    handler: async (request, h) => {
      // console.log("hello");
      date = "2023-04-22";
      return h.response({ message: "Hello, Hapi!", Date: `${moment().utc()}` });
    },
    description: "Greets the user with a message", // Short description
    notes: "Returns a greeting message and the current UTC timestamp.", // Additional details
    tags: ["api"], // Tags used in Swagger UI
    response: {
      schema: Joi.object({ // Define the response schema using Joi
        message: Joi.string().example("Hello, Hapi!"),
        Date: Joi.string().example("2023-04-22T12:34:56Z"),
      }),
    },
  }
  });

  await registerPlugins();

  // server.route({
  //   method: "POST",
  //   path: "/create-index",
  //   handler: async (request, h) => {
  //     // console.log("hello");
  //     const { index } = request.payload;
  //     try {
  //       const response = await client.indices.create({ index });
  //       return h.response(response).code(201);
  //     } catch (error) {
  //       return h.response(error.message).code(500);
  //     }
  //   },
  // });
  // server.route([
  //   {
  //     method: "POST",
  //     path: "/add-document",
  //     handler: async (request, h) => {
  //       // console.log("hello");
  //       const { index, id, body } = request.payload;
  //       try {
  //         const response = await client.index({
  //           index,
  //           id,
  //           document: body,
  //         });
  //         return h.response(response).code(201);
  //       } catch (error) {
  //         return h.response(error.message).code(500);
  //       }
  //     },
  //   },
  // {
  //   method: "POST",
  //   path: "/document",
  //   handler: async (request, h) => {
  //     const { index, id, body } = request.payload;
  //     try {
  //       const response = await client.index({
  //         index,
  //         id,
  //         body,
  //       });
  //       return h.response(response).code(201);
  //     } catch (error) {
  //       console.error(error);
  //       return h.response({ error: error.message }).code(500);
  //     }
  //   },
  // },
  // {
  //   method: "GET",
  //   path: "/document/{index}/{id}",
  //   handler: async (request, h) => {
  //     const { index, id } = request.params;
  //     try {
  //       const response = await client.get({
  //         index,
  //         id,
  //       });
  //       return h.response(response).code(200);
  //     } catch (error) {
  //       console.error(error);
  //       return h.response({ error: error.message }).code(404);
  //     }
  //   },
  // },
  // {
  //   method: "GET",
  //   path: "/document",
  //   handler: async (request, h) => {
  //     // const { index, id } = request.params;
  //     try {
  //       const response = await client.search({
  //         index:"my-index",
  //         query:{ match_all: {} }
  //       });
  //       return h.response(`${process.pid},${response}`).code(200);
  //     } catch (error) {
  //       console.error(error);
  //       return h.response({ error: error.message }).code(404);
  //     }
  //   },
  // },
  // Update a document

  // {
  //   method: "PUT",
  //   path: "/document",
  //   handler: async (request, h) => {
  //     const { index, id, body } = request.payload;
  //     try {
  //       const response = await client.update({
  //         index,
  //         id,
  //         body: { doc: body },
  //       });
  //       return h.response(response).code(200);
  //     } catch (error) {
  //       console.error(error);
  //       return h.response({ error: error.message }).code(500);
  //     }
  //   },
  // },
  // Delete a document
  //   {
  //     method: "DELETE",
  //     path: "/document/{index}/{id}",
  //     handler: async (request, h) => {
  //       const { index, id } = request.params;
  //       try {
  //         const response = await client.delete({
  //           index,
  //           id,
  //         });
  //         return h.response(response).code(200);
  //       } catch (error) {
  //         console.error(error);
  //         return h.response({ error: error.message }).code(500);
  //       }
  //     },
  //   }
  // ]);

  // server.route({
  //   method: "GET",
  //   path: "/search",
  //   handler: async (request, h) => {
  //     // console.log("hello");
  //     const { index, query } = request.query;
  //     try {
  //       const response = await client.search({
  //         index,
  //         query: { match: { content: query } },
  //       });
  //       return h.response(response).code(200);
  //     } catch (error) {
  //       return h.response(error.message).code(500);
  //     }
  //   },
  // });
  // server.initialize();

  // server.start()
  // console.log(`server start on ${port}`);
  // Initialize the server for testing (without starting it)
  // const memoryUsage = process.memoryUsage();
  // const cpuUsage = process.cpuUsage();
  // // console.log(memoryUsage);
  // console.log(cpuUsage);
  process.on("SIGTERM", gracefulShutdown);

  return server;
};
// console.log(require.main);
// let cpus = os.cpus().length
// if(cluster.isPrimary){
//   console.log(`Master process is running with PID: ${process.pid}`);
//   console.log(`Forking ${cpus} workers...`);
//   for(i=0;i<cpus;i++){
//     cluster.fork()
//   }

// }
// else{
if (require.main === module) {
  // Normal server start
  (async () => {
    const server = await init();
    
    await server.start();
    console.log(
      `Server process is ${process.pid} running at: ${server.info.uri}`
    );
  })();
} else {
  // Export the server for testing
  module.exports = { init };
}

// }
