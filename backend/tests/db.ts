import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Logger from "../src/utils/logger";

// Define a new instance of "MongoMemoryServer" to automatically start server
let mongoServer: MongoMemoryServer;

// For mongodb-memory-server's old version (< 7) use this instead:
// const mongoServer = new MongoMemoryServer();

// Provide connection to a new in-memory database server.
const connect = async () => {
    try {
        // Prevent MongooseError: Can't call `openUri()` on
        // an active connection with different connection strings
        await mongoose.disconnect();

        // Spin up an actual/real MongoDB server programmatically from node, for testing
        mongoServer = await MongoMemoryServer.create();

        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    } catch (e: any) {
        Logger.error(`ERROR: ${e.message}`);
    }
};

// Remove and close the database and server.
const close = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

// Remove all data from collections.
const clear = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

export = {
    connect,
    close,
    clear
};
