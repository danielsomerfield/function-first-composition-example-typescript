import { Express } from "express";
import { createTopRatedHandler } from "./controller";
import * as topRated from "../../src/restaurantRatings/topRated";
import { calculateRatingForRestaurant } from "./ratingsAlgorithm";

export const init = (
  express: Express,
  factories: Factories = productionFactories,
) => {

  const topRatedDependencies = {
    findRatingsByRestaurant: () => {
      throw "NYI";
    },
    calculateRatingForRestaurant,
    getRestaurantById: () => {
      throw "NYI";
    },
  };
  const getTopRestaurants = factories.topRatedCreate(topRatedDependencies);
  const handler = factories.handlerCreate({
    getTopRestaurants,
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

