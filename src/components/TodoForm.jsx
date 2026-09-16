import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_TODO, GET_TODOS } from "../graphql/todos";

function TodoForm() {
  const [title, setTitle] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const [addTodo, { loading, error }] = useMutation(ADD_TODO, {
    update(cache, { data }) {
      const newTodo = data?.createTodo;

      if (!newTodo) {
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
            data: [newTodo, ...existingTodos],
          },
        },
      });
    },
  });
  const hasMessage = Boolean(validationMessage || error);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationMessage("Please enter a todo.");
      return;
    }

    setValidationMessage("");

    try {
      await addTodo({
        variables: {
          title: trimmedTitle,
          completed: false,
        },
      });
      setTitle("");
    } catch {
      // The user-facing message is rendered below.
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="todo-title">
        Todo title
      </label>

      <input
        id="todo-title"
        className="todo-input"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setValidationMessage("");
        }}
        placeholder="Add a todo..."
        autoComplete="off"
        aria-describedby={hasMessage ? "todo-form-message" : undefined}
        disabled={loading}
      />

      <button className="todo-add-button" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Todo"}
      </button>

      {validationMessage && (
        <p className="todo-mutation-error" id="todo-form-message">
          {validationMessage}
        </p>
      )}
      {error && (
        <p className="todo-mutation-error" id="todo-form-message">
          Unable to add todo.
        </p>
      )}
    </form>
  );
}

export default TodoForm;
