import 'dotenv/config'

const MONGODB_URI = process.env["MONGODB_URL"]

const config = {
    mongodb_url: MONGODB_URI
}

export default config