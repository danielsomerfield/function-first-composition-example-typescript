import { PoolClient } from "pg";

interface Dependencies {}

interface Dependencies {
  getClient: () => Promise<PoolClient>;
  releaseConnection: (client: PoolClient) => void;
}

interface Restaurant {
  id: string;
  name: string;
}

interface Row {
  id: string;
  name: string;
}

export const createGetRestaurantById = (dependencies: Dependencies) => {
  return async (id: string): Promise<Restaurant | undefined> => {
    const client = await dependencies.getClient();
    try {
      const result = await client.query<Row>(
        `
            select id,
                   name
            from restaurant
            where id = $1
        `,
        [id],
      );
      const rows = result.rows;
      return rows.length == 0
        ? undefined
        : {
            id: rows[0].id,
            name: rows[0].name,
          };
    } finally {
      dependencies.releaseConnection(client);
    }
  };
};
