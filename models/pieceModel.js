const mongoose = require("mongoose")

const PieceSchema = new mongoose.Schema({
    description: {type: String, required: true},
    order: {type: Number, required:true},
    reformId: {type: mongoose.Schema.Types.ObjectId, ref:"Reform", required:true}
})

module.exports = mongoose.model("Piece", PieceSchema)