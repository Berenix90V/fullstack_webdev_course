import 'dotenv/config'

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGO_URL
const TEST_MONGO_URL = process.env.TEST_MONGO_URL

const config = {
    port: PORT,
    mongodb_url: MONGODB_URL,
    test_mongodb_url: TEST_MONGO_URL
}
export default config
