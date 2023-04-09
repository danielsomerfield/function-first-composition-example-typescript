interface Dependencies {
  getRestaurantById: (id: string) => Promise<Restaurant>;
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

  // <codeFragment name="getTopRestaurants">
  const getTopRestaurants = async (city: string): Promise<Restaurant[]> => {
    const {
      findRatingsByRestaurant,
      calculateRatingForRestaurant,
      getRestaurantById,
    } = dependencies;

    const toRestaurant = async (r: OverallRating) => { // ref-to-restaurant
      const restaurant = await getRestaurantById(r.restaurantId);
      return {
        id: r.restaurantId,
        name: restaurant.name,
      };
    };

    const ratingsByRestaurant = await findRatingsByRestaurant(city);

    const overallRatings = calculateRatings(
      ratingsByRestaurant,
      calculateRatingForRestaurant,
    );

    return Promise.all(  // ref-promise-all
      sortByOverallRating(overallRatings).map(r => {
        return toRestaurant(r);
      }),
    );
  };
  // </codeFragment>

  const sortByOverallRating = (overallRatings: OverallRating[]) =>
    overallRatings.sort((a, b) => b.rating - a.rating);

  return getTopRestaurants;
};

interface Restaurant {
  id: string;
  name: string;
}

export const rating = {
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const;

export type Rating = keyof typeof rating;
