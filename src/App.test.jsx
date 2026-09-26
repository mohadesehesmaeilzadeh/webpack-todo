import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import App from "./App";
import { ADD_TODO, DELETE_TODO, UPDATE_TODO_COMPLETION } from "./graphql/todoMutations";
import { GET_TODOS } from "./graphql/todoQueries";

function createTodo(id, title, completed = false) {
  return {
    __typename: "Todo",
    id,
    title,
    completed,
  };
}

function getTodosMock(todos, overrides = {}) {
  return {
    request: {
      query: GET_TODOS,
    },
    result: {
      data: {
        todos: {
          __typename: "TodosPage",
          data: todos,
        },
      },
    },
    ...overrides,
  };
}

function renderApp(mocks) {
  return render(
    <MockedProvider mocks={mocks}>
      <App />
    </MockedProvider>
  );
}

describe("Todo app", () => {
  test("shows the todo loading state", () => {
    renderApp([getTodosMock([], { delay: 100 })]);

    expect(screen.getByRole("status")).toHaveTextContent("Loading todos...");
  });

  test("shows a safe GraphQL error state", async () => {
    renderApp([
      {
        request: { query: GET_TODOS },
        error: new Error("GraphQL request failed"),
      },
    ]);

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load todos.");
    expect(screen.getByRole("button", { name: "Try Again" })).toBeEnabled();
  });

  test("shows the empty state", async () => {
    renderApp([getTodosMock([])]);

    expect(await screen.findByText("No todos yet.")).toHaveAttribute("role", "status");
  });

  test("adds a todo from the mutation result", async () => {
    const existingTodo = createTodo("101", "Existing todo");
    const addedTodo = createTodo("103", "Write focused tests");

    renderApp([
      getTodosMock([existingTodo]),
      {
        request: {
          query: ADD_TODO,
          variables: {
            title: addedTodo.title,
            completed: false,
          },
        },
        result: {
          data: {
            createTodo: addedTodo,
          },
        },
      },
    ]);

    await screen.findByText(existingTodo.title);
    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: addedTodo.title },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Todo" }));

    expect(await screen.findByText(addedTodo.title)).toBeInTheDocument();
    expect(screen.getByText("2 Todos")).toBeInTheDocument();
  });

  test("toggles a todo from the mutation result", async () => {
    const pendingTodo = createTodo("101", "Toggle this todo");
    const completedTodo = { ...pendingTodo, completed: true };

    renderApp([
      getTodosMock([pendingTodo]),
      {
        request: {
          query: UPDATE_TODO_COMPLETION,
          variables: {
            id: pendingTodo.id,
            completed: true,
          },
        },
        result: {
          data: {
            updateTodo: completedTodo,
          },
        },
      },
    ]);

    const checkbox = await screen.findByRole("checkbox", {
      name: `Mark ${pendingTodo.title} as completed`,
    });
    fireEvent.click(checkbox);

    await waitFor(() => expect(checkbox).toBeChecked());
    expect(within(screen.getByRole("listitem")).getByText("Completed")).toBeInTheDocument();
  });

  test("deletes a todo after a successful mutation", async () => {
    const todo = createTodo("101", "Delete this todo");

    renderApp([
      getTodosMock([todo]),
      {
        request: {
          query: DELETE_TODO,
          variables: {
            id: todo.id,
          },
        },
        result: {
          data: {
            deleteTodo: true,
          },
        },
      },
    ]);

    await screen.findByText(todo.title);
    fireEvent.click(screen.getByRole("button", { name: `Delete ${todo.title}` }));

    await waitForElementToBeRemoved(() => screen.queryByText(todo.title));
    expect(screen.getByRole("status")).toHaveTextContent("No todos yet.");
    expect(screen.getByText("0 Todos")).toBeInTheDocument();
  });

  test("filters todos by all, active, and completed", async () => {
    const activeTodo = createTodo("101", "Active todo");
    const completedTodo = createTodo("102", "Completed todo", true);

    renderApp([getTodosMock([activeTodo, completedTodo])]);

    await screen.findByText(activeTodo.title);
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument();
    expect(screen.queryByText(completedTodo.title)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.queryByText(activeTodo.title)).not.toBeInTheDocument();
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText(activeTodo.title)).toBeInTheDocument();
    expect(screen.getByText(completedTodo.title)).toBeInTheDocument();
  });
});
