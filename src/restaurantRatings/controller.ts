import { Request, Response } from "express";
// <codeFragment name="controller">

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
    const city = request.params["city"]
    response.contentType("application/json");
    const restaurants = await getTopRestaurants(city);
    response.status(200).send({ restaurants });
  };
};
// </codeFragment>
