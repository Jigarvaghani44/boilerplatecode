const Loginlogout = require('../models/loginLogout/loginLogout')
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const Joi = require('joi')

const loginlogoutRoutes = [
    {
        method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            try {
                const data = request.payload;
                const existingUser = await Loginlogout.find({ email: data.email });
                if (existingUser.length === 0) {
                    const hashedPassword = await bcrypt.hash(data.password, 10);
                    data.password = hashedPassword;

                    await Loginlogout.insertMany(data);
                    return h.response({ message: 'User registered successfully', data }).code(201);
                } else {
                    return h.response({ error: 'User already exists' }).code(409);
                }
            } catch (err) {
                console.log(err);
                return h.response(err).code(500);
            }
        },
        options: {
            auth: false,
            description: 'Register a new user',
            notes: 'Creates a new user in the system',
            tags: ['api', 'register'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                },)
            },
        },
    },
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                const user = await Loginlogout.find({ email });

                if (!user || user.length === 0) {
                    return h.response({ error: 'Invalid email or password' }).code(401);
                }

                const isPasswordValid = await bcrypt.compare(password, user[0].password);
                if (!isPasswordValid) {
                    return h.response({ error: 'Invalid email or password' }).code(401);
                }

                const token = Jwt.token.generate(
                    { userId: user[0]._id }, // Payload
                    { key: process.env.SECRETE_ID, algorithm: 'HS256' } // Secret and algorithm
                );

                return h.response({ message: 'Login successful', token })
                    .header('Authorization', `Bearer ${token}`)
                    .code(200);
            } catch (err) {
                console.log(err);
                return h.response(err).code(500);
            }
        },
        options: {
            auth: false,
            description: 'Login a user',
            notes: 'Authenticates a user and returns a JWT token',
            tags: ['api', 'login'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                },)
            },
        },
    },
    {
        method: 'POST',
        path: '/logout',
        handler: async (request, h) => {
            // In a real scenario, the JWT would be invalidated or client-side token would be deleted
            return h.response({ message: 'Logout successful' }).code(200);
        },
        options: {
            description: 'Logout the user',
            notes: 'Logs the user out, but JWT tokens cannot be directly invalidated',
            tags: ['api', 'logout'],
        },
    },
    {
        method: 'GET',
        path: '/protected',
        handler: (request, h) => {
            return { message: 'You have access!', user: request.auth.credentials };
        },
        options: {
            description: 'Access protected route',
            notes: 'This route is protected and requires a valid JWT token',
            tags: ['api', 'protected'],
        },
    },
];

module.exports = loginlogoutRoutes;



// const Loginlogout = require('../models/loginLogout/loginLogout')
// const Jwt = require('@hapi/jwt');
// const bcrypt = require('bcrypt');

// const loginlogoutRoutes=[
//     {
//         method: 'POST',
//         path: '/register',
//         handler: async (request, h) => {
//             try{
//                 const data = request.payload;
//                 console.log(data);
//                 const existingUser = await Loginlogout.find({email:data.email});
//                 if(!existingUser==[]){
//                        // Hash the password
//                     const hashedPassword = await bcrypt.hash(data.password, 10);
//                     data.password= hashedPassword
//                     console.log(data);
    
    
//                     // Store user in the database (example)
//                    await Loginlogout.insertMany(data);
//                     return h.response({ message: 'User registered successfully', data }).code(201);
//                 }
//                 else{
//                     return h.response().code(500)
//                 }
               
//             }
//             catch(err){
//                console.log(err);
//               return h.response(err)
                
//             }
          
//         },
//         options: {
//             auth: false,
//         },
//     },
//     {
//         method: 'POST',
//         path: '/login',
//         handler: async (request, h) => {
//             try{
//                 const { email, password } = request.payload;
// // console.log(email,password);

//                 // Find user in database
//                 const user =await Loginlogout.find({email});
              
                
//                 if (!user) {
//                     return h.response({ error: 'Invalid email or password' }).code(401);
//                 }
//                 console.log(user[0].password);
//                 // console.log(password);
//                 // Verify password
//                 const isPasswordValid = await bcrypt.compare(password, user[0].password);
//                 // console.log(isPasswordValid);
//                 if (!isPasswordValid) {
//                     return h.response({ error: 'Invalid email or password' }).code(401);
//                 }
//                 console.log(process.env.SECRETE_ID);
//                 // Generate JWT token
//                 const token = Jwt.token.generate(
                    
                    
//                     { userId: user.id }, // Payload
//                     { key: process.env.SECRETE_ID, algorithm: 'HS256' } // Secret and algorithm
//                 );
    
//                 return h.response({ message: 'Login successful', token }).header('Authorization', `Bearer ${token}`)
//                 .code(200);
//             }
//             catch(err){
//                 return console.log(err);
                
//             }
           
//         },
//         options: {
//             auth:false,
//         },
//     },
//     {
//         method: 'POST',
//         path: '/logout',
//         handler: async (request, h) => {
//             return h.response({ message: 'Logout successful' }).code(200);
            
//         },
       
//     },
//     {
//         method: 'GET',
//         path: '/protected',
       
//             handler: (request, h) => {
//                 return { message: 'You have access!', user: request.auth.credentials };
//             },
//             options: {
//                 auth: 'jwt', // Requires authentication via JWT
//             },
//     },
// ]
// module.exports = loginlogoutRoutes;