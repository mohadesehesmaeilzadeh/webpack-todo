# Webpack Todo App

A Todo application built manually with React/Webpack without CRA, Next.js, or Vite. It uses Apollo Client with the GraphQLZero Todo API and includes a production-ready Webpack build.

## Features

- Manual React and Webpack setup without CRA, Next.js, or Vite
- JSX transpilation with Babel
- CSS bundling with CSS Loader and Style Loader
- Local development with Webpack Dev Server and HMR
- Apollo Client integration with the GraphQLZero Todo API
- Todo fetching, adding, toggling, and deleting
- All, Active, and Completed todo filters
- Responsive UI for desktop and mobile screens
- Optimized production build with minification and code splitting

## Technologies

- React
- Webpack
- Babel
- CSS Loader / Style Loader
- Apollo Client
- GraphQL
- GraphQLZero
- Webpack Dev Server
- Terser

## Installation

```bash
npm install
```

## Development

```bash
npm run start
```

## Production Build

```bash
npm run build
```

## API

The default API endpoint is:

```bash
FAKEQL_ENDPOINT=https://graphqlzero.almansi.me/api
```

Create a local `.env` file from `.env.example` and set `FAKEQL_ENDPOINT` before running the app locally.

This project uses GraphQLZero as a fake GraphQL API. Mutations are simulated and may reset after a browser refresh, so Todo changes are not permanently stored on the server.

## Deployment

GitHub repository: [webpack-todo](https://github.com/mohadesehesmaeilzadeh/webpack-todo)

Deployment target: Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `FAKEQL_ENDPOINT=https://graphqlzero.almansi.me/api`
- Production URL: add your Netlify URL here after deployment
