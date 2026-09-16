import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App";
import client from "./apollo/client";
import "./styles.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
