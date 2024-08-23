const express= require("express")
const router =  express.Router()
const clientController = require("../controllers/clientController")
const authMiddleware = require("../middlewares/authMiddleware")

// obtiene los clientes
router.get("/clients", authMiddleware, clientController.getClients)

//agrega un cliente
router.post("/add-client", authMiddleware, clientController.addClient)

//borra el cliente
router.delete("/delete-client/:id", authMiddleware, clientController.deleteClient)

//obtiene el cliente por su id
router.get("/:clientId", authMiddleware, clientController.getClientById)

//actualiza el cliente.
router.put("/update-client/:id", authMiddleware, clientController.updateClient)

module.exports = router