const Client = require("../models/clientModel")
const Reform = require("../models/reformModel")
const Piece = require("../models/pieceModel")

const clientController = {
    addClient: async function (req, res) {
        const { name, lastname, patentVehicle, address, phone, DNI, vehicleBrand, vehicleModel, mileage, reforms } = req.body
        try {
            const newClient = new Client({ name, lastname, patentVehicle, address, phone, DNI, vehicleBrand, vehicleModel, mileage })
            const busqueda = await Client.findOne({ name, lastname, vehicleBrand, vehicleModel })
            if (busqueda) {
                return res.status(404).send({ message: "El cliente ya existe." })

            }
            const reformsAdd = reforms.map(async (reform) => {
                const newReform = new Reform({ ...reform, clientId: newClient._id })

                const piecesAdd = reform.pieces.map(async (piece) => { //por cada pieza haz una nueva
                    const newPiece = new Piece({ ...piece, reformId: newReform._id })
                    await newPiece.save()
                    newReform.pieces.push(newPiece)
                    return newPiece._id
                })

                newReform.pieces = await Promise.all(piecesAdd)
                await newReform.save()
                return newReform._id
            })


            newClient.reforms = await Promise.all(reformsAdd)

            await newClient.save()
            res.status(200).json({ message: "Cliente guardado exitosamente." })
        } catch (error) {
            res.status(500).json({ message: "Ha ocurrido un error al registrar el cliente: " + error })
        }
    },
    getClients: async function (req, res) {
        try {
            const clients = await Client.find().populate('reforms')
            res.json(clients)
        } catch (error) {
            res.status(500).send({ message: "Ha ocurrido un error al traer los clientes." })
        }
    },
    deleteClient: async function (req, res) {
        try {
            const clientToDelete = await Client.findByIdAndDelete(req.params.clientId)
            if (!clientToDelete) {
                return res.status(404).send({ message: "No se pudo encontrar el cliente." })
            }
            res.status(200).send({ message: "Cliente borrado exitosamente." })
        } catch (error) {
            res.status(500).send("Ha ocurrido un error de servidor.")
        }
    },
    updateClient: async function (req, res) {
        try {
            console.log(req.params.clientId);

            const { name, lastname, patentVehicle, address, phone, DNI, vehicleBrand, vehicleModel, mileage } = req.body
            const updatedClient = await Client.findByIdAndUpdate(req.params.clientId, { name, lastname, patentVehicle, address, phone, DNI, vehicleBrand, vehicleModel, mileage }, { new: true })
            if (!updatedClient) {
                return res.status(404).send("No se pudo actualizar el cliente.")
            }
            res.status(200).send({ message: "Cliente actualizado exitosamente." })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Ha ocurrido un error de servidor. " + error })
        }
    },
    getClientById: async function (req, res) {
        try {
            const { clientId } = req.params
            const busqueda = await Client.findById(clientId)
            if (!busqueda) {
                return res.status(404).json({ message: "El cliente no existe." })
            }
            res.status(200).json(busqueda)
        } catch (error) {
            return res.status(500).send("Ha ocurrido un error de servidor: " + error)
        }
    }
}

module.exports = clientController