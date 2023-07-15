import 'dotenv/config'

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGO_URL

const config ={
    port: PORT,
    mongodb_url: MONGODB_URL
}
export default config
