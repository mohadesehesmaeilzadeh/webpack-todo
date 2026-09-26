const { gql } = require("@apollo/client");

const ADD_TODO = gql`
  mutation AddTodo($title: String!, $completed: Boolean!) {
    createTodo(input: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO_COMPLETION = gql`
  mutation UpdateTodoCompletion($id: ID!, $completed: Boolean!) {
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
  UPDATE_TODO_COMPLETION,
};
