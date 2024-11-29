const Redis = require("ioredis");
const { getContributors } = require("../models/github/app");
const axios = require("axios");
// Create Redis client
// const Repository = require("../models/Repository/repository");
const redisClient = new Redis();
apiUserUrl = "http://localhost:3000/user-insert";
const apiRepoUrl = "http://localhost:3000/api/v1/repo";
const GITHUB_API_URL = "https://api.github.com";
const contributionApiUrl = "http://localhost:3000/contri-insert";

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
      const response = await axios.get(
        `${apiRepoUrl}/${encodeURIComponent(repo.full_name)}`
      );
      // let temp = repo.slice((0,5))
      // console.log(repo);

      // Simulate fetching contributors
      let query = {per_page:100, page:1}
            const limitedContributer = await getContributors(repo.full_name,query)
            console.log(limitedContributer.data.length)
            for (i = 0; i < limitedContributer.data.length; i++) {
                let temp = {
                  id: limitedContributer.data[i].id,
                  login: limitedContributer.data[i].login,
                  avatar_url: limitedContributer.data[i].avatar_url,
                  html_url: limitedContributer.data[i].html_url,
                  type: limitedContributer.data[i].type,
                  contributions: limitedContributer.data[i].contributions
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

      //  insert in contributer
      const resLineCountAndContributer = await axios.get(
        `${GITHUB_API_URL}/repos/${repo.full_name}/stats/contributors`
        // {
        //   headers: {
        //     Authorization: `Bearer ${TOKEN}`, // Authorization header
        //   },
        // }
      );
      // console.log(resLineCountAndContributer);

      const contributors = resLineCountAndContributer.data;

      if (!contributors || contributors.length === 0) {
        console.log("No contributors found.");
        return;
      }
     
      const contributorStats = contributors.map((contributor) => {
        const totalLines = contributor.weeks.reduce(
          (total, week) => total + (week.a - week.d), // Calculate net lines (additions - deletions)
          0
        );

        return {
          repository: response.data.res[0].id,
          user: contributor.author.id,
          line_count: totalLines
          
        };
      });
      

      for (let i = 0; i < contributorStats.length; i++) {
        let temp ={
          id:i+1,
          repository:contributorStats[i].repository,
          user:contributorStats[i].user,
          line_count:contributorStats[i].line_count
        }
        console.log(temp);
        
        
        axios
          .post(contributionApiUrl, temp)
          .then((response) => {
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error.message);
          });
      }
    }
  });
})();
// let obj ={
//   repository: {
//     _id: '6748396efef9e292549343ed',
//     id: 6498492,
//     owner: {
//       login: 'airbnb',
//       id: 698437,
//       node_id: 'MDEyOk9yZ2FuaXphdGlvbjY5ODQzNw==',
//       avatar_url: 'https://avatars.githubusercontent.com/u/698437?v=4',
//       gravatar_id: '',
//       url: 'https://api.github.com/users/airbnb',
//       html_url: 'https://github.com/airbnb',
//       followers_url: 'https://api.github.com/users/airbnb/followers', 
//       following_url: 'https://api.github.com/users/airbnb/following{/other_user}',
//       gists_url: 'https://api.github.com/users/airbnb/gists{/gist_id}',
//       starred_url: 'https://api.github.com/users/airbnb/starred{/owner}{/repo}',
//       subscriptions_url: 'https://api.github.com/users/airbnb/subscriptions',
//       organizations_url: 'https://api.github.com/users/airbnb/orgs',  
//       repos_url: 'https://api.github.com/users/airbnb/repos',
//       events_url: 'https://api.github.com/users/airbnb/events{/privacy}',
//       received_events_url: 'https://api.github.com/users/airbnb/received_events',
//       type: 'Organization',
//       user_view_type: 'public',
//       site_admin: false
//     },
//     full_name: 'airbnb/javascript',
//     description: 'JavaScript Style Guide',
//     html_url: 'https://github.com/airbnb/javascript',
//     language: 'JavaScript',
//     stargazers_count: 145508,
//     __v: 0
//   },
//   user: {
//     id: 8030945,
//     login: 'reiss',
//     avatar_url: 'https://avatars.githubusercontent.com/u/803092?v=4', 
//     html_url: 'https://github.com/reissbaker',
//     type: 'User'
//   },
//   line_count: -15
// }
// let obj2 = JSON.stringify(obj)
// console.log(obj2);
