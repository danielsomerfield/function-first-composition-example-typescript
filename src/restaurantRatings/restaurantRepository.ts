interface Dependencies {}

export const createGetRestaurantById: (
  dependencies: Dependencies,
) => (id: string) => Promise<Restaurant | undefined> = (
  dependencies: Dependencies,
) => {
  return id => {
    throw "getRestaurantById: NYI";
  };
};

interface Restaurant {
  id: string;
  name: string;
}
