import express from "express";
import request from "supertest";
import * as ratingsSubdomain from "../../src/restaurantRatings/index";
import { productionFactories } from "../../src/restaurantRatings";

describe("the controller top rated handler", () => {

  it("delegates to the domain top rated logic", async () => {
    const returnedRestaurants = [
      { id: "r1", name: "restaurant1" },
      { id: "r2", name: "restaurant2" },
    ];

    const topRated = () => Promise.resolve(returnedRestaurants);

    const app = express();
    ratingsSubdomain.init(
      app,
      productionFactories.replaceFactoriesForTest({
        topRatedCreate: () => topRated,
      }),
    );

    const response = await request(app).get(
      "/vancouverbc/restaurants/recommended",
    );
    expect(response.status).toEqual(200);
    expect(response.get("content-type")).toBeDefined();
    expect(response.get("content-type").toLowerCase()).toContain("json");
    const payload = response.body as RatedRestaurants;
    expect(payload.restaurants).toBeDefined();
    expect(payload.restaurants.length).toEqual(2);
    expect(payload.restaurants[0].id).toEqual("r1");
    expect(payload.restaurants[1].id).toEqual("r2");
  });
});

interface RatedRestaurants {
  restaurants: { id: string; name: string }[];
}