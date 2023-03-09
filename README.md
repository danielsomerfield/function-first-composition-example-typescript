# TDD and function-first composition with TypeScript

# Instructions

## Running the unit tests

    npm test:unit

## Running the integration tests

    npm test:integration

## Running the application

    docker-compose up -d
    npm start

  You should then be able to access the service endpoint at `http://localhost:3000/restaurants/recommended`

# Points of interest

- Each typescript module defines a type with its own dependent functions.
- At the top level of the DI module the index.ts does the binding
- Rather than constructors for components, typescript modules expose a factory function that takes dependencies and
  returns either a "configured" function or component.