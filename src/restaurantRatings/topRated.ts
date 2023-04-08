// <codeFragment name="top-rated">
interface Dependencies { // ref-dependencies
  findRatingsByRestaurant: (city: string) => Promise<RatingsByRestaurant[]>;
  calculateRatingForRestaurant: (ratings: RatingsByRestaurant) => number;
}

interface OverallRating { // ref-overall-ratings
  restaurantId: string;
  rating: number;
}

interface RestaurantRating { // ref-extract-types
  rating: Rating;
}

interface RatingsByRestaurant {
  restaurantId: string;
  ratings: RestaurantRating[];
}

export const create = (dependencies: Dependencies) => { // ref-function-factory
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

  const getTopRestaurants = async (city: string): Promise<Restaurant[]> => {
    const { findRatingsByRestaurant, calculateRatingForRestaurant } =
      dependencies;

    const ratingsByRestaurant = await findRatingsByRestaurant(city);

    const overallRatings = calculateRatings(
      ratingsByRestaurant,
      calculateRatingForRestaurant,
    );

    const toRestaurant = (r: OverallRating) => ({
      id: r.restaurantId,
    });

    return sortByOverallRating(overallRatings).map(r => {
      return toRestaurant(r);
    });
  };

  const sortByOverallRating = (overallRatings: OverallRating[]) =>
    overallRatings.sort((a, b) => b.rating - a.rating);

  return getTopRestaurants;
};

//SNIP ..

// </codeFragment>

interface Restaurant {
  id: string;
}

export const rating = {
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const;

export type Rating = keyof typeof rating;
