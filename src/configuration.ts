export interface Configuration {
  serverPort: number;
  ratingsDB: {
    user: string;
    password: string;
    host: string;
    database: string;
  }
}