const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

let invalidTokens = []

const userController = {
    registerUser: async function (req, res) {
        const { name, lastname, email, username, password } = req.body;
        try {
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ name, lastname });
            const count = await User.countDocuments({ role: 'admin' })
            if (userExists) {
                return res.status(403).send("Este usuario ya existe. No puedes registrarlo de nuevo.");
            }
            if (count >= 2) {
                return res.status(403).send("Existen 2 usuarios ya, no puedes crear nuevos.")
            }
            // Crear el nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 9);
            const newUser = new User({ name, lastname, email, username, password: hashedPassword, role: "admin" });
            await newUser.save();

            res.status(200).send("Usuario registrado exitosamente.");
        } catch (error) {
            res.status(500).json({ message: "Ha ocurrido un error. Inténtelo más tarde: " + error });
        }
    },
    loginUser: async function (req, res) {
        const { username, password } = req.body
        try {
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(404).json({ message: "No se ha encontrado el usuario." })
            }
            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                return res.status(401).json({ message: "Credenciales incorrectas." })
            }
            const token = jwt.sign({ username: user.username, role: user.role }, "secret_key", { expiresIn: "55m" })//3 parametros, como el username y el role. El paramettro secret_key y el tiempo de expiracion: ({}, "", {})
            res.json({ token, userId: user._id }) //PASARLE DOS PARAMETROS
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    getUsers: async function (req, res) {
        try {
            const users = await User.find()
            if (!users) {
                return res.status(404).send("No hay usuarios registrados")
            }
            res.json(users)
        } catch (error) {
            return res.status(500).send("Ha ocurrido un error al mostrar los usuarios: " + error)
        }
    },
    logoutUser: async function (req, res) {
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(401).send("Access denied.")
        }
        if (invalidTokens.includes(token)) {
            return res.status(401).send("Token expirado o es inválido.")
        }
        invalidTokens.push(token)
        res.send("Sesión cerrada con éxito.")
    },
    dashboardUser: async function (req, res) {
        try {
            const userId = req.params.userId
            const user = await User.findById(userId)
            if (user) {
                return res.json(user)
            }
        } catch (error) {
            return res.status(500).json({ message: "Error del servidor." + error })
        }
    },
    deleteUser: async function (req, res) {
        try {
            const userId = req.params.userId
            const user = await User.findByIdAndDelete(userId)
            if (user) {
                return res.json(user)
            }
        } catch (error) {
            return res.status(500).send("Ocurrio un error interno.")
        }
    },
    updateDataUser: async function (req, res) {
        try {
            const { name, lastname, email, username, currentPassword } = req.body
            const user = await User.findById(req.params.userId)
            
            const isValidPassword = await bcrypt.compare(currentPassword, user.password)
            if(!isValidPassword){
                return res.status(401).json({message: "Tu contraseña no es correcta."})
            }
            const updatedUser = await User.findByIdAndUpdate(user._id, { name, lastname, email, username}, { new: true })
            if (!updatedUser) {
                res.status(404).send("No se pudo localizar el usuario.")
            }
            res.json(updatedUser)
        } catch (error) {
            res.status(500).send("Ha ocurrido un error de servidor." + error)
        }
    },
    updatePassword: async function(req,res){
        try {
            const user = await User.findById(req.params.userId)
            const {currentPassword, newPassword, confirmNewPassword} = req.body
            if(newPassword !== confirmNewPassword){
                return res.status(422).json({error: "Las contraseñas no coinciden."})
            }
            const isValidPassword = await bcrypt.compare(currentPassword, user.password)
            
            if(!isValidPassword){
                return res.status(401).json({message: "La contraseña ingresada como actual es incorrecta."})
            }
            const hashedPassword = await bcrypt.hash(confirmNewPassword, 9)
            const updatePassword = await User.findByIdAndUpdate(req.params.userId, {password: hashedPassword}, {new:true})
            res.json(updatePassword)
        } catch (error) {
            return res.status(500).json({message: "Ha ocurrido un error en el servidor." + error})
        }
    }
}

module.exports = userController