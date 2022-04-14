import express, { Application } from "express";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import morganMiddleware from "./middlewares/morgan";
import mongoose from "mongoose";
import routes from "./routes";

// Load env vars
dotenv.config({ path: path.join(__dirname, "/../../.env") });

const { MONGO_DB_CONNECT } = process.env;

// Set up mongoose connection
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(MONGO_DB_CONNECT as string).catch(console.error);
}

// Create express app
const app: Application = express();

// Enable CORS
app.use(
    cors({
        origin: "*"
    })
);

// Enable Middlewares
app.use(morganMiddleware);
app.use(express.json());
app.use(routes);

export = app;
