const axios = require('axios');

const BASE_URL = 'https://api.github.com';

// Function to search repositories
const searchRepositories =async (query = {}) => {
  // query={q:"language:javascript"}
  // console.log(query);
  
  const params = new URLSearchParams(query).toString();
  // console.log(params);
  
  return await axios.get(`${BASE_URL}/search/repositories?${params}`)
};

// Function to get contributors
const getContributors = (repository, query = {}) => {
  if (!repository) {
    throw new Error("Repository name is required");
  }
  const params = new URLSearchParams(query).toString();
  return axios.get(`${BASE_URL}/repos/${repository}/contributors?${params}`);
};
// searchRepositories({q:"language:javascript"})
module.exports = { searchRepositories, getContributors };
