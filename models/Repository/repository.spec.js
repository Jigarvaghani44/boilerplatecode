const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;  // Chai assertion library
const Repository = require('./repository'); // Adjust the path to your model

// Mocking MongoDB connection before tests
before(async () => {
    await mongoose.connect('mongodb://localhost:27017/github');
});

// Clean up the database after each test
afterEach(async () => {
    await Repository.deleteMany({});
});

// Close the connection after all tests are done
after(async () => {
    await mongoose.connection.close();
});

describe('Repository Model', () => {
    
    it('should create a new repository with valid data', async () => {
        const repositoryData = {
            id: 12345,
            owner: 67890,
            full_name: 'test-repo',
            description: 'This is a test repository',
            html_url: 'http://github.com/test-repo',
            language: 'JavaScript',
            stargazers_count: 10,
        };

        const repository = new Repository(repositoryData);
        const savedRepository = await repository.save();

        // Assert that the repository is saved and the fields are correct
        expect(savedRepository._id).to.exist;
        expect(savedRepository.id).to.equal(12345);
        expect(savedRepository.owner).to.equal(67890);
        expect(savedRepository.full_name).to.equal('test-repo');
        expect(savedRepository.description).to.equal('This is a test repository');
        expect(savedRepository.html_url).to.equal('http://github.com/test-repo');
        expect(savedRepository.language).to.equal('JavaScript');
        expect(savedRepository.stargazers_count).to.equal(10);
    });

    it('should throw an error if a required field is missing', async () => {
        const invalidRepositoryData = {
            owner: 67890,
            full_name: 'test-repo',
            description: 'This is a test repository',
            html_url: 'http://github.com/test-repo',
            language: 'JavaScript',
            stargazers_count: 10,
        };

        const repository = new Repository(invalidRepositoryData);

        try {
            await repository.save();
        } catch (err) {
            console.log(err);
            
            expect(err).to.exist;
            expect(err.errors).to.have.property('id');
            expect(err.errors.id.message).to.equal('Path `id` is required.');
        }
    });

    it('should throw an error if the "id" field is not a number', async () => {
        const invalidRepositoryData = {
            id: 'invalid-id', // id should be a number, not a string
            owner: 67890,
            full_name: 'test-repo',
            description: 'This is a test repository',
            html_url: 'http://github.com/test-repo',
            language: 'JavaScript',
            stargazers_count: 10,
        };

        const repository = new Repository(invalidRepositoryData);

        try {
            await repository.save();
        } catch (err) {
            // console.log(err.message);
            
            expect(err).to.exist;
            expect(err.message).to.include('Repository validation failed: id: Cast to Number failed for value "invalid-id" (type string) at path "id"');
        }
    });

    it('should throw an error if the "owner" field is missing', async () => {
        const invalidRepositoryData = {
            id: 12345,
            full_name: 'test-repo',
            description: 'This is a test repository',
            html_url: 'http://github.com/test-repo',
            language: 'JavaScript',
            stargazers_count: 10,
        };

        const repository = new Repository(invalidRepositoryData);

        try {
            await repository.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('owner');
            expect(err.errors.owner.message).to.equal('Path `owner` is required.');
        }
    });
});
