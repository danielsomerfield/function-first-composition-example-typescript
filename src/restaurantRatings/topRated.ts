import { Rating } from "./rating";

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
  ratedByUser: User;
}

interface User {
  id: string;
  isTrusted: boolean;
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

  const getTopRestaurants = async (city: string): Promise<Restaurant[]> => {
    const {
      findRatingsByRestaurant,
      calculateRatingForRestaurant,
      getRestaurantById,
    } = dependencies;

    const toRestaurant = async (r: OverallRating) => {
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

    return Promise.all(
      sortByOverallRating(overallRatings).map(r => toRestaurant(r)),
    );
  };

  const sortByOverallRating = (overallRatings: OverallRating[]) =>
    overallRatings.sort((a, b) => b.rating - a.rating);

  return getTopRestaurants;
};

interface Restaurant {
  id: string;
  name: string;
}

