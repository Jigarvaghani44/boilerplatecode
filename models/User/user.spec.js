const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect; // Chai's assertion library
const User = require('./user'); // Replace with the actual path to your model

// Connect to a test database before the tests run
before(async () => {
    await mongoose.connect('mongodb://localhost:27017/github');
});

// Clean up the database after each test
afterEach(async () => {
    await User.deleteMany({});
});

// Close the database connection after all tests are done
after(async () => {
    await mongoose.connection.close();
});

describe('User Model', () => {
    
    it('should create a new user with valid data', async () => {
        const userData = {
            id: 12345,
            login: 'testuser',
            avatar_url: 'http://example.com/avatar.jpg',
            html_url: 'http://example.com',
            type: 'User',
        };

        const user = new User(userData);
        const savedUser = await user.save();

        // Assert that the user is saved correctly
        expect(savedUser._id).to.exist;
        expect(savedUser.id).to.equal(12345);
        expect(savedUser.login).to.equal('testuser');
        expect(savedUser.avatar_url).to.equal('http://example.com/avatar.jpg');
        expect(savedUser.html_url).to.equal('http://example.com');
        expect(savedUser.type).to.equal('User');
    });

    it('should throw a validation error if "id" is missing', async () => {
        const invalidUserData = {
            login: 'testuser',
            avatar_url: 'http://example.com/avatar.jpg',
            html_url: 'http://example.com',
            type: 'User',
        };

        const user = new User(invalidUserData);

        try {
            await user.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('id');
            expect(err.errors.id.message).to.equal('Path `id` is required.');
        }
    });

    it('should throw a validation error if "login" is missing', async () => {
        const invalidUserData = {
            id: 12345,
            avatar_url: 'http://example.com/avatar.jpg',
            html_url: 'http://example.com',
            type: 'User',
        };

        const user = new User(invalidUserData);

        try {
            await user.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('login');
            expect(err.errors.login.message).to.equal('Path `login` is required.');
        }
    });

    it('should throw a validation error if "avatar_url" is not provided', async () => {
        const invalidUserData = {
            id: 12345,
            login: 'testuser',
            html_url: 'http://example.com',
            type: 'User',
        };

        const user = new User(invalidUserData);

        try {
            await user.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('avatar_url');
            expect(err.errors.avatar_url.message).to.equal('Path `avatar_url` is required.');
        }
    });

    it('should throw a validation error if "type" is not provided', async () => {
        const invalidUserData = {
            id: 12345,
            login: 'testuser',
            avatar_url: 'http://example.com/avatar.jpg',
            html_url: 'http://example.com',
        };

        const user = new User(invalidUserData);

        try {
            await user.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('type');
            expect(err.errors.type.message).to.equal('Path `type` is required.');
        }
    });

    it('should throw an error if "id" is not a number', async () => {
        const invalidUserData = {
            id: 'invalid-id', // id should be a number
            login: 'testuser',
            avatar_url: 'http://example.com/avatar.jpg',
            html_url: 'http://example.com',
            type: 'User',
        };

        const user = new User(invalidUserData);

        try {
            await user.save();
        } catch (err) {
            console.log(err.message)
            expect(err).to.exist;
            expect(err.message).to.include('User validation failed: id: Cast to Number failed for value "invalid-id" (type string) at path "id"');
        }
    });
});
