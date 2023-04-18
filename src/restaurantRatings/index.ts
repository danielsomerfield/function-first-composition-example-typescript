import { Express } from "express";
import { createTopRatedHandler } from "./controller";
import * as topRated from "../../src/restaurantRatings/topRated";
import { calculateRatingForRestaurant } from "./ratingsAlgorithm";
import { createFindRatingsByRestaurant } from "./ratingsRepository";
import { createGetRestaurantById } from "./restaurantRepository";

export const init = (
  express: Express,
  factories: Factories = productionFactories,
) => {
  const topRatedDependencies = {
    findRatingsByRestaurant: factories.findRatingsByRestaurantCreate({}),
    calculateRatingForRestaurant,
    getRestaurantById: factories.getRestaurantByIdCreate({}),
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
  findRatingsByRestaurantCreate: typeof createFindRatingsByRestaurant;
  getRestaurantByIdCreate: typeof createGetRestaurantById;
  replaceFactoriesForTest: (replacements: Partial<Factories>) => Factories;
}

export const productionFactories: Factories = {
  getRestaurantByIdCreate: createGetRestaurantById,
  handlerCreate: createTopRatedHandler,
  topRatedCreate: topRated.create,
  findRatingsByRestaurantCreate: createFindRatingsByRestaurant,
  replaceFactoriesForTest: (replacements: Partial<Factories>): Factories => {
    return { ...productionFactories, ...replacements };
  },
};
