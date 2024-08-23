const mongoose = require("mongoose")

const UserModel = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin"] }
})

module.exports = mongoose.model("User", UserModel)