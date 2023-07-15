import 'dotenv/config'

const port = process.env.PORT
const mongodb_url = process.env.MONGODB_URL

const config = {port, mongodb_url}
export default config