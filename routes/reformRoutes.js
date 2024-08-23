const express= require("express")
const router = express()
const reformController = require("../controllers/reformController")
const authMiddleware = require("../middlewares/authMiddleware")

//rutas
router.get("/client/reforms/:reformId", authMiddleware, reformController.getReformById)
router.get("/reforms/client/:clientId", authMiddleware, reformController.getReformsByClientId)
router.post("/client/:clientId/reforms", authMiddleware, reformController.addReform)
router.delete("/clients/reforms/:reformId", authMiddleware, reformController.deleteReform)
router.put("/reforms/:reformId/update", authMiddleware, reformController.updateReform)

module.exports= router