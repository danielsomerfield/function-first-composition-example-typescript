import { rating } from "./topRated.spec";
import { calculateRatingForRestaurant } from "../../src/restaurantRatings/ratingsAlgorithm";

describe("The ratings algorithm", () => {
  it("handles empty ratings", () => {
    const overallRating = calculateRatingForRestaurant({
      restaurantId: "restaurant1",
      ratings: [],
    });
    expect(overallRating).toEqual(0);
  });

  it("passes through the rating for an untrusted user", () => {
    const overallRating = calculateRatingForRestaurant({
      restaurantId: "restaurant1",
      ratings: [
        { rating: "EXCELLENT", ratedByUser: { id: "user1", isTrusted: false } },
      ],
    });
    expect(overallRating).toEqual(rating.EXCELLENT);
  });

  it("provides additional weighting for a trusted user", () => {
    const overallRating = calculateRatingForRestaurant({
      restaurantId: "restaurant1",
      ratings: [
        { rating: "EXCELLENT", ratedByUser: { id: "user1", isTrusted: true } },
      ],
    });
    expect(overallRating).toEqual(rating.EXCELLENT * 4);
  });
});
