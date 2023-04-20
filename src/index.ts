import * as server from "./server";

const getRequiredConfiguration = (name: string) => {
  const configurationValue = process.env[name];
  if (!configurationValue) {
    throw new Error(`${name} is a required environment variable`);
  }
  return configurationValue;
};

export const getConfigurationFromEnvVars = async () => {
  return {
    serverPort: 3000,
    ratingsDB: {
      user: getRequiredConfiguration("REVIEW_DATABASE_USER"),
      password: getRequiredConfiguration("REVIEW_DATABASE_PASSWORD"),
      host: getRequiredConfiguration("REVIEW_DATABASE_HOST"),
      database: getRequiredConfiguration("REVIEW_DATABASE_DATABASE"),
      port: Number.parseInt(getRequiredConfiguration("REVIEW_DATABASE_PORT")),
    },
  };
};

(async () => {
  await server.start(getConfigurationFromEnvVars);
})();
