const { GET_TODOS } = require("../graphql/todoQueries");

function updateCachedTodos(cache, updateTodos) {
  const existingData = cache.readQuery({ query: GET_TODOS });
  const existingTodos = existingData?.todos?.data;

  if (!Array.isArray(existingTodos)) {
    return;
  }

  cache.writeQuery({
    query: GET_TODOS,
    data: {
      todos: {
        ...existingData.todos,
        data: updateTodos(existingTodos),
      },
    },
  });
}

function addTodoToCache(cache, newTodo) {
  if (!newTodo) {
    return;
  }

  updateCachedTodos(cache, (todos) => [
    newTodo,
    ...todos.filter((todo) => todo.id !== newTodo.id),
  ]);
}

function updateTodoInCache(cache, updatedTodo) {
  if (!updatedTodo) {
    return;
  }

  updateCachedTodos(cache, (todos) =>
    todos.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo))
  );
}

function removeTodoFromCache(cache, todoId) {
  updateCachedTodos(cache, (todos) => todos.filter((todo) => todo.id !== todoId));
}

module.exports = {
  addTodoToCache,
  removeTodoFromCache,
  updateTodoInCache,
};
