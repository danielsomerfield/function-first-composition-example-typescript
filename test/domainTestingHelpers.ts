import { Client } from "pg";

interface User {
  id: string;
  name: string;
  trusted: boolean;
}

interface Restaurant {
  id: string;
  name: string;
}

export const createUser = async (user: User, client: Client) => {
  return await client.query(
    'insert into "user" (id, name, trusted) values ($1, $2, $3)',
    [user.id, user.name, user.trusted],
  );
};

export const createRestaurant = async (
  restaurant: Restaurant,
  client: Client,
) => {
  return await client.query(
    "insert into restaurant (id, name) values ($1, $2)",
    [restaurant.id, restaurant.name],
  );
};

export const createRatingByUserForRestaurant = async (
  id: string,
  user: User,
  restaurant: Restaurant,
  rating: string,
  client: Client,
) => {
  return await client.query(
    "insert into restaurant_rating (id, rated_by_user_id, restaurant_id, rating) VALUES ($1, $2, $3, $4)",
    [id, user.id, restaurant.id, rating],
  );
};
