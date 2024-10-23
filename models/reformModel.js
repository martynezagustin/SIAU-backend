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
    repairNumber: {
        type: Number,
        required:true
    },
    ticketNumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required:true
    },
    pieces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Piece"
    }],
    labour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Labour"
    },
})

module.exports = mongoose.model("Reform", ReformSchema)