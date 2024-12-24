const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");


const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("Hola desde el servidor!");
});

app.post("/register", async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const existingUser = await prisma.usuario.findUnique({
            where: { usuario },
        });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                usuario,
                contrasena: hashedPassword,
            },
        });

        res.status(201).json({
            message: "Usuario registrado con éxito.",
            usuario: nuevoUsuario.usuario,
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ error: "Hubo un problema al registrar el usuario." });
    }
});

app.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const user = await prisma.usuario.findUnique({
            where: { usuario },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta." });
        }

        res.status(200).json({ message: "Login exitoso." });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión." });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;