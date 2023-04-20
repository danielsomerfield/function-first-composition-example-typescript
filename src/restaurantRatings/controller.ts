import { Request, Response } from "express";
import { StatusCode } from "../statusCode";

interface Restaurant {
  id: string;
  name: string;
}

interface Dependencies {
  getTopRestaurants(city: string): Promise<Restaurant[]>;
}

export const createTopRatedHandler = (dependencies: Dependencies) => {
  const { getTopRestaurants } = dependencies;
  return async (request: Request, response: Response) => {
    try {
      const city = request.params["city"]
      response.contentType("application/json");
      const restaurants = await getTopRestaurants(city);
      response.status(200).send({ restaurants });
    } catch (e) {
      console.error("Unexpected error", e);
      response.status(500).send({
        message: "Unexpected error",
        statusCode: StatusCode.UNEXPECTED,
      });
    }

  };
};
