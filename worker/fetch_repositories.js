const Redis = require("ioredis");
const { searchRepositories } = require("../models/github/app");
const Repository = require("../models/Repository/repository");
const axios = require("axios");
// Create Redis clients
const redisClient = new Redis();
const apiUrl = "http://localhost:3000/repo-insert";
const publisher = new Redis(); // Separate connection for publishing

(async () => {
  console.log("Repository Worker connected to Redis.");

  // Subscribe to the `fetch_repositories` channel
  redisClient.subscribe("fetch_repositories", (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err.message);
    } else {
      console.log(`Subscribed to ${count} channel(s).`);
    }
  });

  redisClient.on("message", async (channel, message) => {
    if (channel === "fetch_repositories") {
      const { query } = JSON.parse(message);
      console.log(`Received query: ${query.q}`);

      // Simulate fetching repositories
      const repositories = await searchRepositories(query);
      const limitedRepositories = repositories.data.items.slice(0,3);
      // console.log(limitedRepositories.length);
      for (i = 0; i < limitedRepositories.length; i++) {
        let temp = {
          id: limitedRepositories[i].id,
          owner: limitedRepositories[i].owner,
          full_name: limitedRepositories[i].full_name,
          description: limitedRepositories[i].description,
          html_url: limitedRepositories[i].html_url,
          language: limitedRepositories[i].language,
          stargazers_count: limitedRepositories[i].stargazers_count,
        };
        axios
          .post(apiUrl, temp)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error.message);
          });
      }

      // Insert the first 20 repositories into MongoDB

      // const res = await Repository.insertMany(repositories.data.items)
      // if(res){
      //     console.log("true");

      // }
      // console.log(repositories.data.items);

    //   Publish repository data to the `fetch_contributions` channel
      for (const repo of limitedRepositories) {
          await publisher.publish('fetch_contributions', JSON.stringify(repo));
          console.log(`Published repository: ${repo.name} to fetch_contributions.`);
      }
    }
  });
})();
