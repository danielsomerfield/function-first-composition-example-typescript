import { Configuration } from "./configuration";
import { Server } from "http";
import * as restaurantRatings from "./restaurantRatings/index";
import express from "express";
import { Socket } from "net";

let server: Server;

export const start = async (
  getConfiguration: () => Promise<Configuration>,
): Promise<Server> => {
  const app = express();
  app.use(express.json());
  const configuration = await getConfiguration();
  restaurantRatings.init(app, {
    db: configuration.ratingsDB,
  });

  const port = configuration.serverPort;

  return new Promise((resolve, reject) => {
    try {
      server = app.listen(port, () => {
        setShutdownCleanup(server, async () => {
          await stop();
        });
        console.log(`Listening on port ${port}`);
        resolve(server);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const stop = async () => {
  await restaurantRatings.shutdown();
  return new Promise<void>((resolve, reject) => {
    if (server) {
      return server.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
};

const connected = new Set<Socket>();

const startSocketDisconnect = () => {
  setTimeout(() => {
    connected.forEach(socket => {
      socket.end();
    });
  }, 5000);
};

export const setShutdownCleanup = (
  server: Server,
  shutdown: () => Promise<void>,
) => {
  server.on("connection", (socket: Socket) => {
    connected.add(socket);
    socket.addListener("close", () => {
      connected.delete(socket);
    });
  });

  process.on("SIGTERM", async () => {
    startSocketDisconnect();
    await shutdown();
    server.close(err => {
      if (err) {
        console.log("Error on server shutdown", err);
      }
      process.exit(0);
    });
  });
};
