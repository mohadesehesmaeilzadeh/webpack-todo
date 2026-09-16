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

const ADD_TODO = gql`
  mutation AddTodo($title: String!, $completed: Boolean!) {
    createTodo(input: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, input: { completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

module.exports = {
  ADD_TODO,
  DELETE_TODO,
  GET_TODOS,
  UPDATE_TODO,
};
