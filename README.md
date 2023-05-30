# TDD and function-first composition with TypeScript

This repository is a companion to the article [Dependency Composition](https://martinfowler.com/articles/dependency-composition.html)
that discusses an alternative approach to building up services using a somewhat unconventional combination of TDD, partial application, and functions as the 
primary compositional unit. Although these examples are written in Typescript, the approach is compatible with other languages
and I will add additional implementations in other languages as time permits.

The code from the article is extracted directly from the `steps` branch of this repo. If you wish to see the process by
which the code was developed, you can walk through the commits one by one. The commits should follow the narrative of the
article. Do not expect the code to run, or even compile, at every stage, particularly the early ones in which I have 
defined intended behaviour in the tests but have not yet implemented it.

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