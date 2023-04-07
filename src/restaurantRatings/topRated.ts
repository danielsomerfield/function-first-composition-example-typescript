// <codeFragment name="top-rated">
interface Dependencies {}


export const create = (dependencies: Dependencies) => { // ref-function-factory
  return async (city: string): Promise<Restaurant[]> => [];
}; // end-ref-function-factory

interface Restaurant { // ref-extract-restaurant
  id: string;
}  // end-ref-extract-restaurant

export const rating = { // ref-extract-rating
  EXCELLENT: 2,
  ABOVE_AVERAGE: 1,
  AVERAGE: 0,
  BELOW_AVERAGE: -1,
  TERRIBLE: -2,
} as const;

export type Rating = keyof typeof rating; // end-ref-extract-rating
// </codeFragment>
