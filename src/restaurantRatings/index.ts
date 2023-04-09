import { Express } from "express";
import { createTopRatedHandler } from "./controller";
import * as topRated from "../../src/restaurantRatings/topRated";

// <codeFragment name="application-assembly">

export const init = (
  express: Express,
  factories: Factories = productionFactories,
) => {
  // TODO: Wire in a stub that matches the dependencies signature for now.
  //  Replace this once we build our additional dependencies.
  const topRatedDependencies = {
    findRatingsByRestaurant: () => {
      throw "NYI";
    },
    calculateRatingForRestaurant: () => {
      throw "NYI";
    },
  };
  const getTopRestaurants = factories.topRatedCreate(topRatedDependencies);
  const handler = factories.handlerCreate({
    getTopRestaurants, // TODO: <-- This line does not compile right now. Why?
  });
  express.get("/:city/restaurants/recommended", handler);
};

interface Factories {
  topRatedCreate: typeof topRated.create;
  handlerCreate: typeof createTopRatedHandler;
  replaceFactoriesForTest: (replacements: Partial<Factories>) => Factories;
}

export const productionFactories: Factories = {
  handlerCreate: createTopRatedHandler,
  topRatedCreate: topRated.create,
  replaceFactoriesForTest: (replacements: Partial<Factories>): Factories => {
    return { ...productionFactories, ...replacements };
  },
};
// </codeFragment>