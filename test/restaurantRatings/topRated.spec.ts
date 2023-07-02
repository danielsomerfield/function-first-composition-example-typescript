import * as topRated from "../../src/restaurantRatings/topRated";

describe("The top rated restaurant list", () => {
  it("is calculated from our proprietary ratings algorithm", async () => {

    const restaurantsById = new Map<string, any>([
      ["restaurant1", { id: "restaurant1", name: "Restaurant 1" }],
      ["restaurant2", { id: "restaurant2", name: "Restaurant 2" }],
    ]);

    const getRestaurantByIdStub = (id: string) => {
      return restaurantsById.get(id);
    };

    const ratings: RatingsByRestaurant[] = [
      {
        restaurantId: "restaurant1",
        ratings: [
          {
            ratedByUser: {
              id: "user1",
              isTrusted: true,
            },
            rating: "EXCELLENT",
          },
        ],
      },
      {
        restaurantId: "restaurant2",
        ratings: [
          {
            ratedByUser: {
              id: "user2",
              isTrusted: false,
            },
            rating: "EXCELLENT",
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

    const findRatingsByRestaurantStub: (
      city: string,
    ) => Promise<RatingsByRestaurant[]> = (city: string) => {
      return Promise.resolve(
        ratingsByCity.filter(r => r.city == city).flatMap(r => r.ratings),
      );
    };

    const calculateRatingForRestaurantStub: (
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
    };

    const dependencies = {
      getRestaurantById: getRestaurantByIdStub,
      findRatingsByRestaurant: findRatingsByRestaurantStub,
      calculateRatingForRestaurant: calculateRatingForRestaurantStub,
    };

    const getTopRated = topRated.create(dependencies);
    const topRestaurants = await getTopRated("vancouverbc");
    expect(topRestaurants.length).toEqual(2);
    expect(topRestaurants[0].id).toEqual("restaurant1");
    expect(topRestaurants[0].name).toEqual("Restaurant 1");
    expect(topRestaurants[1].id).toEqual("restaurant2");
    expect(topRestaurants[1].name).toEqual("Restaurant 2");

  });
});

interface RatingsByRestaurant {
  restaurantId: string;
  ratings: RestaurantRating[];
}

interface RestaurantRating {
  rating: Rating;
  ratedByUser: User
}

interface User {
  id: string;
  isTrusted: boolean;
}

export const rating = {
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const;

export type Rating = keyof typeof rating;
