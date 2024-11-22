const mongoose = require("mongoose")
const ClientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    patentVehicle: {type: String}, //numero de patente, hay que agregar
    address: {type: String, required: true},
    phone: {type: String, required: true},
    DNI: {type: Number, required: false},
    vehicleBrand: {type: String, required: true},
    vehicleModel: {type: String, required: true},
    mileage: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    reforms: [{type: mongoose.Schema.Types.ObjectId, ref: "Reform"}]
})
module.exports = mongoose.model("Client", ClientSchema)