import "dotenv/config";

const port = process.env.PORT;
const mongodb_url =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URL
        : process.env.MONGODB_URL;

const config = { port, mongodb_url };
export default config;
