import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { addTodoToCache } from "../apollo/todoCache";
import { ADD_TODO } from "../graphql/todoMutations";

function TodoForm() {
  const [title, setTitle] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const [addTodo, { loading, error, reset }] = useMutation(ADD_TODO, {
    update(cache, { data }) {
      addTodoToCache(cache, data?.createTodo);
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
    <form className="todo-form" onSubmit={handleSubmit} aria-busy={loading}>
      <label className="todo-label" htmlFor="todo-title">
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

          if (error) {
            reset();
          }
        }}
        placeholder="Add a todo..."
        autoComplete="off"
        aria-describedby={hasMessage ? "todo-form-message" : undefined}
        aria-invalid={hasMessage}
        disabled={loading}
      />

      <button className="todo-add-button" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Todo"}
      </button>

      {validationMessage && (
        <p className="todo-mutation-error" id="todo-form-message" role="alert">
          {validationMessage}
        </p>
      )}
      {error && (
        <p className="todo-mutation-error" id="todo-form-message" role="alert">
          Unable to add todo.
        </p>
      )}
    </form>
  );
}

export default TodoForm;
