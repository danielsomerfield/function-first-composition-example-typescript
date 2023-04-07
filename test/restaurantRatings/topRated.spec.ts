import * as topRated from "../../src/restaurantRatings/topRated";

// <codeFragment name="top-rated-unit-test">
describe("The top rated restaurant list", () => {
  it("is calculated from our proprietary ratings algorithm", async () => {
    const ratings: RatingsByRestaurant[] = [
      {
        restaurantId: "restaurant1",
        ratings: [
          {
            rating: "EXCELLENT",
          },
        ],
      },
      {
        restaurantId: "restaurant2",
        ratings: [
          {
            rating: "AVERAGE",
          },
        ],
      },
    ];

    const ratingsByCity = [
      {
        city: "vancouverbc",
        ratings,
      },
    ];

    const findRatingsByRestaurantStub: (city: string) => Promise< // ref-finder
      RatingsByRestaurant[]
    > = (city: string) => {
      return Promise.resolve(
        ratingsByCity.filter(r => r.city == city).flatMap(r => r.ratings),
      );
    }; // end-ref-finder

    const calculateRatingForRestaurantStub: ( // ref-algorithm
      ratings: RatingsByRestaurant,
    ) => number = ratings => {
      // I don't know how this is going to work, so I'll use a dumb but predictable stub
      if (ratings.restaurantId === "restaurant1") {
        return 10;
      } else if (ratings.restaurantId == "restaurant2") {
        return 5;
      } else {
        throw new Error("Unknown restaurant");
      }
    }; // end-ref-algorithm

    const dependencies = { // ref-dependencies
      findRatingsByRestaurant: findRatingsByRestaurantStub,
      calculateRatingForRestaurant: calculateRatingForRestaurantStub,
    }; // end-ref-dependencies

    const getTopRated: (city: string) => Promise<Restaurant[]> =
      topRated.create(dependencies);
    const topRestaurants = await getTopRated("vancouverbc");
    expect(topRestaurants.length).toEqual(2);
    expect(topRestaurants[0].id).toEqual("restaurant1");
    expect(topRestaurants[1].id).toEqual("restaurant2");
  });
});

interface Restaurant {
  id: string;
}

interface RatingsByRestaurant { // ref-ratings-by-restaurant
  restaurantId: string;
  ratings: RestaurantRating[];
} // end-ref-ratings-by-restaurant

interface RestaurantRating {
  rating: Rating;
}

export const rating = { // ref-rating-type
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const; // end-ref-rating-type

export type Rating = keyof typeof rating;
// </codeFragment>
