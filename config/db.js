const mongoose = require("mongoose")
require("dotenv").config()
const dbUrl = process.env.DB_URL

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl)
    } catch (error) {
        process.exit(1)
    }
}

module.exports = connectDB

