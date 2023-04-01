import { Request, Response } from "express";
// <codeFragment name="controller-stub">
export const createTopRatedHandler = () => {
  return async (request: Request, response: Response) => {
    response.status(200).contentType("application/json").send({});
  };
};
// </codeFragment>
