import winston from "winston";

// Logger levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Logger level selection based on environment
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
};

// Add colors to the logger
winston.addColors(colors);

// Style the logger output
const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp}: ${info.message}`)
);

// Create the logger from configuration above
const Logger = winston.createLogger({
    level: level(),
    levels,
    format
});

export default Logger;
