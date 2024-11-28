const Redis = require("ioredis");
const { getContributors } = require("../models/github/app");
const axios = require("axios");
// Create Redis client
const Repository = require("../models/Repository/repository");
const redisClient = new Redis();
apiUserUrl = "http://localhost:3000/user-insert";
const apiRepoUrl = "http://localhost:3000/repo";
const GITHUB_API_URL = 'https://api.github.com';
const contributionApiUrl="http://localhost:3000/contri-insert"

(async () => {
  console.log("Contributions Worker connected to Redis.");

  // Subscribe to the `fetch_contributions` channel
  redisClient.subscribe("fetch_contributions", (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err.message);
    } else {
      console.log(`Subscribed to ${count} channel(s).`);
    }
  });

  redisClient.on("message", async (channel, message) => {
    if (channel === "fetch_contributions") {
      const repo = JSON.parse(message);

      console.log(`Fetching contributors for repository: ${repo.name}`);
      console.log(repo.full_name);
      try {
        // Replace {full_name} with the actual value
        const response = await axios.get(`${apiRepoUrl}/${encodeURIComponent(repo.full_name)}`);
        console.log('Repository Data:', response.data.res[0]);
      } catch (error) {
        console.error('Error fetching repository:', error.message);
      }

      //   }
      // let temp = repo.slice((0,5))
      // console.log(repo);

      // Simulate fetching contributors
      const limitedContributer = await getContributors(repo.full_name)

      for (i = 0; i < limitedContributer.length; i++) {
          let temp = {
            id: limitedContributer[i].id,
            login: limitedContributer[i].login,
            avatar_url: limitedContributer[i].avatar_url,
            html_url: limitedContributer[i].html_url,
            type: limitedContributer[i].type
          };
          axios
            .post(apiUserUrl, temp)
            .then((response) => {
              console.log("Response:", response.data);
            })
            .catch((error) => {
              console.error("Error:", error.message);
            });
        }

      const resLineCountAndContributer = await axios.get(
        `${GITHUB_API_URL}/repos/${repo.full_name}/stats/contributors`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${TOKEN}`, // Authorization header
        //   },
        // }
      );
  
      const contributors = resLineCountAndContributer.data;

      if (!contributors || contributors.length === 0) {
        console.log('No contributors found.');
        return;
      }
      const contributorStats = contributors.map((contributor) => {
        const totalLines = contributor.weeks.reduce(
          (total, week) => total + (week.a - week.d), // Calculate net lines (additions - deletions)
          0
        );
  
        return {
        repository :response.data.res[0], 
          user: {
            id: contributor.author.id,
            login: contributor.author.login,
            avatar_url: contributor.author.avatar_url,
            html_url: contributor.author.html_url,
            type: contributor.author.type,
          },
          line_count: totalLines,
        };
      });  
      axios
            .post(contributionApiUrl, contributorStats)
            .then((response) => {
              console.log("Response:", response.data);
            })
            .catch((error) => {
              console.error("Error:", error.message);
            });
    }
  });
})();
