import { Handler } from "express";
import * as controller from "../../src/restaurantRatings/controller";
import { stubRequest, stubResponse } from "../stubs/http";

// <codeFragment name="controller-unit-test">
describe("the ratings controller", () => {
  it("provides a JSON response with ratings", async () => {
    const ratingsHandler: Handler = controller.createTopRatedHandler();
    const request = stubRequest();
    const response = stubResponse();

    await ratingsHandler(request, response, () => {});
    expect(response.statusCode).toEqual(200);
    expect(response.getHeader("content-type")).toEqual("application/json");
    expect(response.getSentBody()).toEqual({});
  });
});

// </codeFragment>
