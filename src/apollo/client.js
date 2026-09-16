const { ApolloClient, HttpLink, InMemoryCache } = require("@apollo/client");

const fakeqlEndpoint = process.env.FAKEQL_ENDPOINT;

if (!fakeqlEndpoint) {
  throw new Error("FAKEQL_ENDPOINT is not configured.");
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: fakeqlEndpoint,
  }),
  cache: new InMemoryCache(),
});

module.exports = client;
