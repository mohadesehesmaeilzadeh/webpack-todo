const { gql } = require("@apollo/client");

const GET_TODOS = gql`
  query GetTodos {
    todos(options: { paginate: { page: 1, limit: 20 } }) {
      data {
        id
        title
        completed
      }
    }
  }
`;

module.exports = { GET_TODOS };
