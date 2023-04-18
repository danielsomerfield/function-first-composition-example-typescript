import express from "express";
import request from "supertest";
import * as ratingsSubdomain from "../../src/restaurantRatings/index";
import { productionFactories } from "../../src/restaurantRatings";
import { Rating } from "./topRated.spec";

describe("the controller top rated handler", () => {
  it("delegates to the domain top rated logic", async () => {
    const ratingsByRestaurant = [
      {
        restaurantId: "restaurant1",
        ratings: [
          {
            rating: "EXCELLENT" as Rating,
            ratedByUser: { id: "user1", isTrusted: true },
          },
        ],
      },
      {
        restaurantId: "restaurant2",
        ratings: [
          {
            rating: "AVERAGE" as Rating,
            ratedByUser: { id: "user2", isTrusted: true },
          },
        ],
      },
    ];

    const restaurants = [
      { id: "restaurant1", name: "Restaurant 1" },
      { id: "restaurant2", name: "Restaurant 2" },
    ];

    const findRatingsByRestaurant = () => Promise.resolve(ratingsByRestaurant);

    const app = express();
    ratingsSubdomain.init(
      app,
      productionFactories.replaceFactoriesForTest({
        findRatingsByRestaurantCreate: _ => findRatingsByRestaurant,
        getRestaurantByIdCreate: _ => (id: string) => {
          const found = restaurants.filter(r => r.id == id);
          return Promise.resolve(found.length == 1 ? found[0] : undefined);
        },
      }),
    );

    ratingsSubdomain.init(app);
    const response = await request(app).get(
      "/vancouverbc/restaurants/recommended",
    );
    expect(response.status).toEqual(200);
    const payload = response.body as RatedRestaurants;
    expect(payload.restaurants).toBeDefined();
    expect(payload.restaurants.length).toEqual(2);

    expect(payload.restaurants[0].id).toEqual("restaurant1");
    expect(payload.restaurants[0].name).toEqual("Restaurant 1");

    // You could also do a more terse but still backwards compat match this way.
    expect(payload.restaurants[1]).toMatchObject({
      id: "restaurant2",
      name: "Restaurant 2",
    });

  });
});

interface RatedRestaurants {
  restaurants: { id: string; name: string }[];
}
