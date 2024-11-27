const { searchRepositories, getContributors } = require('./app');
const nock = require('nock');
const chai = require('chai');
const { expect } = chai;

const BASE_URL = 'https://api.github.com';

describe('GitHub API Wrappers', () => {
  afterEach(() => {
    nock.cleanAll(); // Clean up any interceptors after each test
  });

  describe('searchRepositories', () => {
    it('should return repositories based on query parameters', async () => {
      const query = { q: 'language:javascript' };
      const mockResponse = {
        total_count: 1,
        items: [{ id: 123, name: 'example-repo' }]
      };

      // Mock the API response
     nock(BASE_URL)
        .get('/search/repositories')
        .query(query)
        .reply(200, mockResponse);

      const response = await searchRepositories(query);
      // console.log(response.status);
      // console.log(response.data);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal(mockResponse);
    });

    it('should return an empty result for no matches', async () => {
      const query = { q: 'language:unknown' };
      const mockResponse = { total_count: 0, items: [] };

      // Mock the API response
      nock(BASE_URL)
        .get('/search/repositories')
        .query(query)
        .reply(200, mockResponse);

      const response = await searchRepositories(query);
      expect(response.status).to.equal(200);
      console.log(response.data);
      
      expect(response.data).to.deep.equal(mockResponse);
    });
  });

  describe('getContributors', () => {
    it('should return contributors for a repository', async () => {
      const repository = 'owner/repo';
      const mockResponse = [
        {
          login: 'user1',
          contributions: 42,
          additions: 100,
          deletions: 50
        }
      ];

      // Mock the API response
      nock(BASE_URL)
        .get(`/repos/${repository}/contributors`)
        .reply(200, mockResponse);

      const response = await getContributors(repository);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal(mockResponse);
    });

    it('should throw an error for missing repository parameter', async () => {
      try {
        await getContributors();
      } catch (error) {
        expect(error.message).to.equal('Repository name is required');
      }
    });

    it('should return an empty array if no contributors exist', async () => {
      const repository = 'owner/empty-repo';
      const mockResponse = [];

      // Mock the API response
      nock(BASE_URL)
        .get(`/repos/${repository}/contributors`)
        .reply(200, mockResponse);

      const response = await getContributors(repository);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal(mockResponse);
    });
  });
});
