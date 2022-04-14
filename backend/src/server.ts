import app from "./app";
import Logger from "./utils/logger";

const { PORT, APP_PROTOCOL, APP_DOMAIN, NODE_ENV } = process.env;

// start the server and listen to specified port
app.listen(PORT || 8081, () => {
    Logger.http(`The application is listening on port ${PORT}`);
    Logger.http(
        `${APP_PROTOCOL}://${APP_DOMAIN}${NODE_ENV === "development" ? `:${PORT}` : ""}`
    );
});
