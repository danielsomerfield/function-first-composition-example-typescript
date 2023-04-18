import { Rating } from "./rating";

interface Dependencies {}

interface RatingsByRestaurant {
  restaurantId: string;
  ratings: { rating: Rating; ratedByUser: { id: string, isTrusted: boolean } }[];
}

export const createFindRatingsByRestaurant: (
  dependencies: Dependencies,
) => () => Promise<RatingsByRestaurant[]> = (
  dependencies: Dependencies,
) => {
  return (): Promise<RatingsByRestaurant[]> => {
    throw "findRatingsByRestaurant: NYI";
  };
};