interface Dependencies {
  findRatingsByRestaurant: (city: string) => Promise<RatingsByRestaurant[]>;
  calculateRatingForRestaurant: (ratings: RatingsByRestaurant) => number;
}

interface OverallRating { 
  restaurantId: string;
  rating: number;
}

interface RestaurantRating { 
  rating: Rating;
}

interface RatingsByRestaurant {
  restaurantId: string;
  ratings: RestaurantRating[];
}

export const create = (dependencies: Dependencies) => { 
  const calculateRatings = (
    ratingsByRestaurant: RatingsByRestaurant[],
    calculateRatingForRestaurant: (ratings: RatingsByRestaurant) => number,
  ): OverallRating[] =>
    ratingsByRestaurant.map(ratings => {
      return {
        restaurantId: ratings.restaurantId,
        rating: calculateRatingForRestaurant(ratings),
      };
    });

  // <codeFragment name="fix-restaurant-contract">

  interface Restaurant {
    id: string;
    name: string,
  }

  const toRestaurant = (r: OverallRating) => ({
    id: r.restaurantId,
    // TODO: I put in a dummy value to
    //  start and make sure our contract is being met
    //  then we'll add more to the testing
    name: "",
  });

  // </codeFragment>

  const getTopRestaurants = async (city: string): Promise<Restaurant[]> => {
    const { findRatingsByRestaurant, calculateRatingForRestaurant } =
      dependencies;

    const ratingsByRestaurant = await findRatingsByRestaurant(city);

    const overallRatings = calculateRatings(
      ratingsByRestaurant,
      calculateRatingForRestaurant,
    );

    return sortByOverallRating(overallRatings).map(r => {
      return toRestaurant(r);
    });
  };

  const sortByOverallRating = (overallRatings: OverallRating[]) =>
    overallRatings.sort((a, b) => b.rating - a.rating);

  return getTopRestaurants;
};

export const rating = {
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const;

export type Rating = keyof typeof rating;
