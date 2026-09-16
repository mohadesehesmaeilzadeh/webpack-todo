import TodoItem from "./TodoItem";

function TodoList({ todos }) {
  return (
    <ul className="todo-list" aria-label="Todos">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
