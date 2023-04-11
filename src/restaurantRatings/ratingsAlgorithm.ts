import { Rating, rating } from "./rating";

// <codeFragment name="ratings-algorithm">
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

export const calculateRatingForRestaurant = (
  ratings: RatingsByRestaurant,
): number => {
  const trustedMultiplier = (curr: RestaurantRating) =>
    curr.ratedByUser.isTrusted ? 4 : 1;
  return ratings.ratings.reduce((prev, curr) => {
    return prev + rating[curr.rating] * trustedMultiplier(curr);
  }, 0);
};
// </codeFragment>
