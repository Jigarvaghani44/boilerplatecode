const { Client } = require('@elastic/elasticsearch');

// Replace with your ElasticSearch server details
const client = new Client({ 
  node: 'http://localhost:9200', // Default local ElasticSearch
 
});

module.exports = client;