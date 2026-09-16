import { useMutation } from "@apollo/client/react";
import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from "../graphql/todos";

function TodoItem({ todo }) {
  const isCompleted = Boolean(todo.completed);
  const statusText = isCompleted ? "Completed" : "Pending";

  const [updateTodo, { loading: isUpdating, error: updateError }] = useMutation(UPDATE_TODO);
  const [deleteTodo, { loading: isDeleting, error: deleteError }] = useMutation(DELETE_TODO, {
    update(cache, { data }) {
      if (!data?.deleteTodo) {
        return;
      }

      const existingData = cache.readQuery({ query: GET_TODOS });
      const existingTodos = existingData?.todos?.data ?? [];

      if (!existingData?.todos) {
        return;
      }

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          todos: {
            ...existingData.todos,
            data: existingTodos.filter((cachedTodo) => cachedTodo.id !== todo.id),
          },
        },
      });
    },
  });

  async function handleToggle() {
    const nextCompleted = !isCompleted;

    try {
      await updateTodo({
        variables: {
          id: todo.id,
          completed: nextCompleted,
        },
        update(cache, { data }) {
          const updatedTodo = data?.updateTodo;
          const existingData = cache.readQuery({ query: GET_TODOS });
          const existingTodos = existingData?.todos?.data ?? [];

          if (!existingData?.todos) {
            return;
          }

          cache.writeQuery({
            query: GET_TODOS,
            data: {
              todos: {
                ...existingData.todos,
                data: existingTodos.map((cachedTodo) => {
                  if (cachedTodo.id !== todo.id) {
                    return cachedTodo;
                  }

                  return {
                    ...cachedTodo,
                    ...updatedTodo,
                    completed: updatedTodo?.completed ?? nextCompleted,
                    title: updatedTodo?.title ?? cachedTodo.title,
                  };
                }),
              },
            },
          });
        },
      });
    } catch {
      // The user-facing message is rendered below.
    }
  }

  async function handleDelete() {
    try {
      await deleteTodo({
        variables: {
          id: todo.id,
        },
      });
    } catch {
      // The user-facing message is rendered below.
    }
  }

  return (
    <li className={`todo-item ${isCompleted ? "completed" : "pending"}`}>
      <label className="todo-check">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          disabled={isUpdating || isDeleting}
          aria-label={`Mark ${todo.title} as ${isCompleted ? "pending" : "completed"}`}
        />
        <span className="todo-title">{todo.title}</span>
      </label>

      <div className="todo-actions">
        <span className="todo-status">{statusText}</span>
        <button
          className="todo-delete-button"
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          aria-label={`Delete ${todo.title}`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {updateError && <p className="todo-mutation-error">Unable to update todo.</p>}
      {deleteError && <p className="todo-mutation-error">Unable to delete todo.</p>}
    </li>
  );
}

export default TodoItem;
