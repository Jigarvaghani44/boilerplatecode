const Loginlogout = require('../models/loginLogout/loginLogout')
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const loginlogoutRoutes=[
    {
        method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            const { email, password } = request.payload;

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store user in the database (example)
           await Loginlogout.insertMany({ id: users.length + 1, email, password: hashedPassword });
            return h.response({ message: 'User registered successfully' }).code(201);
        },
        options: {
            auth: false, // Public route
        },
    },
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            const { email, password } = request.payload;

            // Find user in database
            const user = users.find((u) => u.email === email);
            if (!user) {
                return h.response({ error: 'Invalid email or password' }).code(401);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return h.response({ error: 'Invalid email or password' }).code(401);
            }

            // Generate JWT token
            const token = Jwt.token.generate(
                { userId: user.id }, // Payload
                { key: 'your_secret_key', algorithm: 'HS256' } // Secret and algorithm
            );

            return h.response({ message: 'Login successful', token }).code(200);
        },
        options: {
            auth: false, // Public route
        },
    },
    {
        method: 'POST',
        path: '/logout',
        handler: async (request, h) => {
            // Handle token invalidation or client-side token removal
            return h.response({ message: 'Logout successful' }).code(200);
        },
    },
    {
        method: 'GET',
        path: '/protected',
        handler: async (request, h) => {
            return h.response({ message: 'Access granted to protected route' }).code(200);
        },
    }
]
module.exports = loginlogoutRoutes;