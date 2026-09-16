import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { GET_TODOS } from "./graphql/todos";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const SAMPLE_TODO_TITLES = {
  1: "Review project requirements",
  2: "Set up Webpack configuration",
  3: "Create the React entry point",
  4: "Add global app styles",
  5: "Connect Apollo Client",
  6: "Fetch todos from GraphQLZero",
  7: "Build filter controls",
  8: "Test the add todo flow",
  9: "Polish the responsive layout",
  10: "Prepare the production build",
  11: "Check loading and error states",
  12: "Verify toggle behavior",
  13: "Confirm delete behavior",
  14: "Review accessibility labels",
  15: "Update the project README",
  16: "Add environment variable notes",
  17: "Clean up unused code",
  18: "Run the final build check",
  19: "Prepare GitHub repository steps",
  20: "Document Netlify deployment settings",
};

function App() {
  const [filter, setFilter] = useState("all");
  const { data, loading, error, refetch } = useQuery(GET_TODOS);
  const todos = (data?.todos?.data ?? []).map((todo) => ({
    ...todo,
    title: SAMPLE_TODO_TITLES[todo.id] ?? todo.title,
  }));
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;
  const showTodoTools = !loading && !error;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  const emptyMessage = {
    all: "No todos yet.",
    active: "No active todos.",
    completed: "No completed todos.",
  }[filter];

  let content;

  if (loading) {
    content = (
      <div className="todo-message todo-loading" role="status">
        <span className="loading-spinner" aria-hidden="true" />
        <span>Loading todos...</span>
      </div>
    );
  } else if (error) {
    content = (
      <div className="todo-message todo-message-error" role="alert">
        <p>Unable to load todos.</p>
        <button className="secondary-button" type="button" onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  } else if (todos.length === 0) {
    content = <p className="todo-message">No todos yet.</p>;
  } else if (filteredTodos.length === 0) {
    content = <p className="todo-message">{emptyMessage}</p>;
  } else {
    content = <TodoList todos={filteredTodos} />;
  }

  return (
    <main className="app">
      <section className="todo-shell">
        <header className="app-header">
          <h1>Webpack Todo App</h1>

          <p>Manage your tasks with React, Webpack and GraphQL.</p>
        </header>

        <TodoForm />

        {showTodoTools && (
          <>
            <div className="todo-toolbar" aria-label="Todo filters">
              {FILTERS.map((filterOption) => (
                <button
                  key={filterOption.value}
                  className={`filter-button ${filter === filterOption.value ? "active" : ""}`}
                  type="button"
                  aria-pressed={filter === filterOption.value}
                  onClick={() => setFilter(filterOption.value)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            <dl className="todo-stats" aria-label="Todo statistics">
              <div>
                <dt>Total</dt>
                <dd>{totalCount} Todos</dd>
              </div>
              <div>
                <dt>Completed</dt>
                <dd>{completedCount} Completed</dd>
              </div>
              <div>
                <dt>Active</dt>
                <dd>{activeCount} Active</dd>
              </div>
            </dl>
          </>
        )}

        <h2>Todos</h2>

        {content}
      </section>
    </main>
  );
}

export default App;
