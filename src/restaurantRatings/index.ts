import { Express } from "express";
import * as topRated from "./topRated";
import { createTopRatedHandler } from "./controller";
import { calculateRatingForRestaurant } from "./ratingsAlgorithm";
import { createFindRatingsByRestaurant } from "./ratingsRepository";
import { createGetRestaurantById } from "./restaurantRepository";
import { Pool, PoolClient } from "pg";

let pool: Pool;

interface Configuration {
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
  };
}

export const init = (
  express: Express,
  configuration: Configuration,
  factories: Factories = productionFactories,
) => {
  pool = new Pool(configuration.db);

  pool.on("error", (err, client) => {
    console.error("Error from connection pool: " + err);
  });

  const dbDependencies = {
    getClient: () => pool.connect(),
    releaseConnection: (client: PoolClient) => {
      client.release();
    },
  };

  const topRatedDependencies = {
    findRatingsByRestaurant:
      factories.findRatingsByRestaurantCreate(dbDependencies),
    calculateRatingForRestaurant,
    getRestaurantById: factories.getRestaurantByIdCreate(dbDependencies),
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

export const shutdown = async () => {
  if (pool) {
    await pool.end();
  }
};
