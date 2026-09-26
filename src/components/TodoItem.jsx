import { useMutation } from "@apollo/client/react";
import { removeTodoFromCache, updateTodoInCache } from "../apollo/todoCache";
import { DELETE_TODO, UPDATE_TODO_COMPLETION } from "../graphql/todoMutations";

function TodoItem({ todo }) {
  const isCompleted = Boolean(todo.completed);
  const statusText = isCompleted ? "Completed" : "Pending";

  const [updateTodo, { loading: isUpdating, error: updateError }] = useMutation(
    UPDATE_TODO_COMPLETION
  );
  const [deleteTodo, { loading: isDeleting, error: deleteError }] = useMutation(DELETE_TODO, {
    update(cache, { data }) {
      if (!data?.deleteTodo) {
        return;
      }

      removeTodoFromCache(cache, todo.id);
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
          updateTodoInCache(cache, data?.updateTodo);
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
    <li
      className={`todo-item ${isCompleted ? "completed" : "pending"}`}
      aria-busy={isUpdating || isDeleting}
    >
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

      {updateError && (
        <p className="todo-mutation-error" role="alert">
          Unable to update todo.
        </p>
      )}
      {deleteError && (
        <p className="todo-mutation-error" role="alert">
          Unable to delete todo.
        </p>
      )}
    </li>
  );
}

export default TodoItem;
