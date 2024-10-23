const express= require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const connectDB = require("./config/db")
const app = express()
const loggerMiddleware = require("./middlewares/loggerMiddleware")
const clientRoutes = require("./routes/clientRoutes")
const userRoutes = require("./routes/userRoutes")
const reformRoutes = require("./routes/reformRoutes")

const PORT = process.env.PORT || 3000
require("dotenv").config()

connectDB()

//middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(loggerMiddleware)
app.use(cors())
//rutas
app.use("/", clientRoutes)
app.use("/", userRoutes)
app.use("/", reformRoutes)
app.get("/", (req,res) => {
    res.send("Backend running!")
})
