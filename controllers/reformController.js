const Reform = require("../models/reformModel")
const Client = require("../models/clientModel")
const Piece = require("../models/pieceModel")
const mongoose = require("mongoose")

const reformController = {
    addReform: async function (req, res) {
        try {
            const { clientId } = req.params
            const { reforms } = req.body
            const client = await Client.findById(clientId)
            if (!client) {
                return res.status(404).send("No se ha encontrado el cliente.")
            }
            const newReforms = []
            for (let reformData of reforms) {
                const newReform = new Reform({ ...reformData, clientId })
                const piecesIds = reformData.pieces.map(async piece => {
                    const newPiece = new Piece({ ...piece, reformId: newReform._id })
                    await newPiece.save()
                    newReform.pieces.push(newPiece)
                    return newPiece._id
                })
                newReform.pieces = await Promise.all(piecesIds)
                await newReform.save()
                client.reforms.push(newReform._id)
                newReforms.push(newReform)
            }

            await client.save()
            res.status(200).json(newReforms)
        } catch (error) {
            res.status(500).send("Ha ocurrido un error, intentalo otra vez: " + error)
        }
    },
    getReformById: async function (req, res) {
        const { reformId } = req.params
        try {
            const reform = await Reform.findById(reformId).populate("pieces")
            if (!reform) {
                return res.status(404).send("No se ha encontrado el trabajo o reforma realizada.")
            }
            res.status(200).json({ reform })
        } catch (error) {
            res.status(500).send("Ha ocurrido un error, vuelve a intentarlo otra vez: " + error)
        }
    },
    getReformsByClientId: async function (req, res) {
        try {
            const clientId = req.params.clientId
            const reforms = await Reform.find({ clientId })
            res.json(reforms)
        } catch (error) {
            res.status(500).send("Ha ocurrido un error: " + error)
        }
    },
    deleteReform: async function (req, res) {
        try {
            const { reformId } = req.params
            const busqueda = await Reform.findByIdAndDelete(reformId)
            if (!busqueda) {
                return res.status(404).json({ message: "No se ha encontrado la reforma." })
            }
            res.status(200).json(busqueda)
        } catch (error) {
            res.status(500).json({ message: "Ocurrió un error de servidor: " + error })
        }
    },
    updateReform: async function (req,res){
        try {
            const {reformId} = req.params
            const {description, date, amount, repairNumber, ticketNumber, pieces} = req.body
            const reform = await Reform.findById(reformId)
            if(!reform|| !reform.pieces){
                return res.status(404).send("No se encontraron: a) La reforma; b) Las piezas.")
            }
            if(!reform){
                return res.status(404).send("No se ha encontrado la reforma.")
            }
            const piecesIds = pieces.map(async piece => {
                const newPiece = new Piece({ ...piece, reformId: reform._id })
                await newPiece.save()
                reform.pieces.push(newPiece)
                return newPiece._id
            })
            
            reform.pieces = await Promise.all(piecesIds)
            const updatedReform = await Reform.findByIdAndUpdate(reformId, {description, date, amount, repairNumber, ticketNumber, pieces: reform.pieces}, {new: true})
            await reform.save()
            res.status(200).json(updatedReform)
        } catch (error) {
            return res.status(500).json({message:"Ha ocurrido un error. " + error})
        }
    }
}

module.exports = reformController