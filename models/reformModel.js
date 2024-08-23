const mongoose = require("mongoose")
const ReformSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        
    },
    description: {
        type: String,
        
    },
    amount: {
        type: Number,
        required:false
        
    },
    order: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        default: Date.now,
        required:true
    },
    pieces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece"
    }]
})

module.exports = mongoose.model("Reform", ReformSchema)