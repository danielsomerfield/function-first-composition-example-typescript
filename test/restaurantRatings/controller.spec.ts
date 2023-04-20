import { Handler } from "express";
import * as controller from "../../src/restaurantRatings/controller";
import { stubRequest, stubResponse } from "../stubs/http";
import { quietLogs } from "../testing";
import { StatusCode } from "../../src/statusCode";

describe("the ratings controller", () => {
  it("provides a JSON response with ratings", async () => {
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
  });

  it("returns a 500 when there is an unexpected error with an error payload", async () => {
    quietLogs();

    const ratingsHandler: Handler = controller.createTopRatedHandler({
      getTopRestaurants: () => {
        return Promise.reject(new Error());
      },
    });

    const request = stubRequest();
    const response = stubResponse();

    await ratingsHandler(request, response, () => {});

    expect(response.statusCode).toEqual(500);
    expect(response.getHeader("content-type")).toEqual("application/json");
    expect(response.getSentBody()).toEqual(
      expect.objectContaining({
        statusCode: StatusCode.UNEXPECTED,
        message: expect.any(String),
      }),
    );
  });
});
