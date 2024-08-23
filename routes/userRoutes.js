const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/logout", authMiddleware, userController.logoutUser)
router.get("/dashboard/:userId", authMiddleware, userController.dashboardUser)
router.get("/users", authMiddleware, userController.getUsers)
router.delete("/delete/:userId", userController.deleteUser)
router.put('/update/:userId', authMiddleware, userController.updateDataUser)
router.put("/update-password/:userId", authMiddleware, userController.updatePassword)

module.exports = router