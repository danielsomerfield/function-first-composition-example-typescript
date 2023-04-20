import { createFindRatingsByRestaurant } from "../../src/restaurantRatings/ratingsRepository";
import { Pool, PoolClient } from "pg";
import { Rating } from "../../src/restaurantRatings/rating";
import { sortByField, sortByValue } from "../testing";
import {
  createRatingByUserForRestaurant,
  createUser,
} from "../domainTestingHelpers";
import * as DB from "../DB";
import { Database } from "../DB";

describe("the ratings repository", () => {
  jest.setTimeout(1000 * 10);
  let database: Database | undefined;
  let pool: Pool;

  const users = [
    { id: "u1", name: "User1", trusted: true },
    { id: "u2", name: "User2", trusted: false },
    { id: "u3", name: "User3", trusted: false },
  ];

  const restaurants = [
    { id: "cafegloucesterid", name: "Cafe Gloucester" },
    { id: "redtunaid", name: "Red Tuna" },
  ];

  const ratingsByUser: [string, any, any, string][] = [
    ["rating1", users[0], restaurants[0], "EXCELLENT"],
    ["rating2", users[1], restaurants[0], "TERRIBLE"],
    ["rating3", users[2], restaurants[0], "AVERAGE"],
    ["rating4", users[2], restaurants[1], "ABOVE_AVERAGE"],
  ];

  beforeEach(async () => {
    database = await DB.start();

    const client = database.getClient();

    await client.connect();

    try {
      for (const user of users) {
        await createUser(user, client);
      }

      for (const rating of ratingsByUser) {
        await createRatingByUserForRestaurant(
          rating[0],
          rating[1],
          rating[2],
          rating[3],
          client,
        );
      }
    } finally {
      await client.end();
    }

    pool = database.createPool()


  });

  afterEach(async () => {
    await pool.end();
    await database?.stop();
  });

  it("loads ratings by restaurant", async () => {
    const findRatingsByRestaurant = createFindRatingsByRestaurant({
      getClient: () => pool?.connect(),
      releaseConnection: (client: PoolClient) => client.release(),
    });

    const ratingsByRestaurant = sortByField(
      await findRatingsByRestaurant(),
      "restaurantId",
    );

    expect(ratingsByRestaurant.length).toEqual(2);
    expect(ratingsByRestaurant[0].restaurantId).toEqual("cafegloucesterid");
    const cafeGloucesterRatings = sortByValue(
      ratingsByRestaurant[0].ratings,
      t => t.ratedByUser.id,
    );

    expect(cafeGloucesterRatings.length).toEqual(3);
    expect(cafeGloucesterRatings[0]).toMatchObject({
      rating: "EXCELLENT" as Rating,
      ratedByUser: {
        id: "u1",
        isTrusted: true,
      },
    });
    expect(cafeGloucesterRatings[1]).toMatchObject({
      rating: "TERRIBLE" as Rating,
      ratedByUser: {
        id: "u2",
        isTrusted: false,
      },
    });
    expect(cafeGloucesterRatings[2]).toMatchObject({
      rating: "AVERAGE" as Rating,
      ratedByUser: {
        id: "u3",
        isTrusted: false,
      },
    });

    const redTunaRatings = sortByField(
      ratingsByRestaurant[1].ratings,
      "ratedByUser",
    );

    expect(ratingsByRestaurant[1].restaurantId).toEqual("redtunaid");
    expect(redTunaRatings.length).toEqual(1);

    expect(redTunaRatings[0]).toMatchObject({
      rating: "ABOVE_AVERAGE" as Rating,
      ratedByUser: {
        id: "u3",
        isTrusted: false,
      },
    });

    expect(pool.idleCount).toEqual(pool.totalCount);
  });
});
