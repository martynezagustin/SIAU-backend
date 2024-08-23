const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const token = req.headers["authorization"]
    if(!token){
        return res.status(403).send("Access denied. No token provided")
    }
    jwt.verify(token, "secret_key", (err,decoded) => { // comprueba el token de los headers, el parametro secret key, y luego unas funciones de ccallback
        if(err){
            return res.status(401).send("Invalid token")
        }
        req.user = decoded // almacena los datos codificados en req.user
        next() //sigue con la prox funcion
    })
}

module.exports = authMiddleware