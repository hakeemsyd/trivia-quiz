import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import dotenv from "dotenv";

dotenv.config();

async function start() {
  // 1) Connect to MongoDB
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/trivia";
  await mongoose.connect(mongoUrl);

  // 2) Create & start ApolloServer
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // 3) Mount Express + ApolloServer
  const app: Application = express();
  server.applyMiddleware({ app, path: "/graphql" });

  // 4) Healthcheck
  app.get("/health", (_req, res) => res.json({ status: "OK" }));

  // 5) Listen
  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log(
      `🚀 GraphQL API running at http://localhost:${port}${server.graphqlPath}`
    )
  );
}

start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
