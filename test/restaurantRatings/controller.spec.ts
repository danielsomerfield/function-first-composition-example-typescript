import { Handler } from "express";
import * as controller from "../../src/restaurantRatings/controller";
import { stubRequest, stubResponse } from "../stubs/http";

describe("the ratings controller", () => {
  it("provides a JSON response with ratings", async () => {
    // <codeFragment name="controller-unit-test">
    type Restaurant = { id: string };
    type RestaurantResponseBody = { restaurants: Restaurant[] };

    const vancouverRestaurants = [
      {
        id: "cafegloucesterid",
        name: "Cafe Gloucester",
      },
      {
        id: "baravignonid",
        name: "Bar Avignon",
      },
    ];

    const topRestaurants = [
      {
        city: "vancouverbc",
        restaurants: vancouverRestaurants,
      },
    ];

    const dependenciesStub = {
      getTopRestaurants: (city: string) => {
        const restaurants = topRestaurants
          .filter(restaurants => {
            return restaurants.city == city;
          })
          .flatMap(r => r.restaurants);
        return Promise.resolve(restaurants);
      },
    };

    const ratingsHandler: Handler =
      controller.createTopRatedHandler(dependenciesStub);
    const request = stubRequest().withParams({ city: "vancouverbc" });
    const response = stubResponse();

    await ratingsHandler(request, response, () => {});
    expect(response.statusCode).toEqual(200);
    expect(response.getHeader("content-type")).toEqual("application/json");
    const sent = response.getSentBody() as RestaurantResponseBody;
    expect(sent.restaurants).toEqual([
      vancouverRestaurants[0],
      vancouverRestaurants[1],
    ]);
    // </codeFragment>
  });
});
