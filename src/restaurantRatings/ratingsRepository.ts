import { Rating } from "./rating";
import { PoolClient } from "pg";
import _ from "lodash";


interface Dependencies {
  getClient: () => Promise<PoolClient>;
  releaseConnection: (client: PoolClient) => void;
}

interface RatingsByRestaurant {
  restaurantId: string;
  ratings: { rating: Rating; ratedByUser: { id: string, isTrusted: boolean } }[];
}

interface Row {
  restaurant_id: string;
  rating: string;
  user_id: string;
  is_trusted: boolean;
}

export const createFindRatingsByRestaurant: (
  dependencies: Dependencies,
) => () => Promise<RatingsByRestaurant[]> = (dependencies: Dependencies) => {
  return async (): Promise<RatingsByRestaurant[]> => {
    const client = await dependencies.getClient();
    try {
      const result = await client.query<Row>(
        `
            select
                rr.restaurant_id,
                rr.rating,
                rr.rated_by_user_id,
                u.id as user_id,
                u.trusted as is_trusted  
            from restaurant_rating rr
            inner join "user" u on rr.rated_by_user_id = u.id`,
      );
      const dictionary = _.groupBy<Row>(result.rows, row => row.restaurant_id);
      return _.map(dictionary, (row, key) => {
        const rowsToRatings = (rows: Row[]) => {
          return rows.map(row => {
            return {
              rating: row.rating as Rating,
              ratedByUser: {
                id: row.user_id,
                isTrusted: row.is_trusted,
              },
            };
          });
        };

        return {
          restaurantId: key,
          ratings: rowsToRatings(row),
        };
      });
    } finally {
      dependencies.releaseConnection(client);
    }
  };
};
