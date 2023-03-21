import axios from "axios";
import { Server } from "http";
import * as server from "../src/server";

import {
  createRatingByUserForRestaurant,
  createRestaurant,
  createUser,
} from "./domainTestingHelpers";
import * as DB from "./DB";
import { Database } from "./DB";

describe("the restaurants endpoint", () => {
  let app: Server | undefined;
  let database: Database | undefined;

  const users = [
    { id: "u1", name: "User1", trusted: true },
    { id: "u2", name: "User2", trusted: false },
    { id: "u3", name: "User3", trusted: false },
  ];

  const restaurants = [
    { id: "cafegloucesterid", name: "Cafe Gloucester" },
    { id: "burgerkingid", name: "Burger King" },
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
      // GIVEN
      // These functions don't exist yet, but I'll add them shortly
      for (const user of users) {
        await createUser(user, client);
      }

      for (const restaurant of restaurants) {
        await createRestaurant(restaurant, client);
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

    app = await server.start(() =>
      Promise.resolve({
        serverPort: 3000,
        ratingsDB: {
          ...DB.connectionConfiguration,
          port: database?.getPort(),
        },
      }),
    );
  });

  afterEach(async () => {
    await server.stop();
    await database?.stop();
  });

  it("ranks by the recommendation heuristic", async () => {
    const response = await axios.get<ResponsePayload>(
      "http://localhost:3000/vancouverbc/restaurants/recommended",
      { timeout: 1000 },
    );
    expect(response.status).toEqual(200);
    const data = response.data;
    const returnRestaurants = data.restaurants.map(r => r.id);
    expect(returnRestaurants).toEqual(["cafegloucesterid", "burgerkingid"]);
  });
});

type ResponsePayload = {
  restaurants: { id: string; name: string }[];
};
