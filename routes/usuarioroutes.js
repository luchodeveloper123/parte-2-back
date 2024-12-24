// // const express = require("express");
// // const bcrypt = require("bcrypt");
// // const { PrismaClient } = require("@prisma/client");
// // const router = express.Router();
// // const prisma = new PrismaClient();


// // router.post("/register", async (req, res) => {
// //     const { usuario, contraseña } = req.body;

// //     if (!usuario || !contraseña) {
// //         return res.status(400).json({ error: "Todos los campos son obligatorios." });
// //     }

// //     try {
// //         const hashedPassword = await bcrypt.hash(contraseña, 10);

// //         await prisma.usuario.create({
// //             data: { usuario, contraseña: hashedPassword },
// //         });

// //         res.status(201).json({ message: "Usuario registrado con éxito." });
// //     } catch (error) {
// //         if (error.code === "P2002") {
// //             res.status(400).json({ error: "El usuario ya existe." });
// //         } else {
// //             res.status(500).json({ error: "Error al registrar el usuario." });
// //         }
// //     }
// // });

// router.post("/login", async (req, res) => {
//     const { usuario, contraseña } = req.body;

//     if (!usuario || !contraseña) {
//         return res.status(400).json({ error: "Todos los campos son obligatorios." });
//     }

//     try {
//         const user = await prisma.usuario.findUnique({
//             where: { usuario },
//         });

//         if (!user) {
//             return res.status(404).json({ error: "Usuario no encontrado." });
//         }

//         const isMatch = await bcrypt.compare(contraseña, user.contraseña);
//         if (!isMatch) {
//             return res.status(401).json({ error: "Contraseña incorrecta." });
//         }

//         res.status(200).json({ message: "Login exitoso." });
//     } catch (error) {
//         res.status(500).json({ error: "Error al iniciar sesión." });
//     }
// });

// router.get("/", async (req, res) => {
//     try {
//         const usuarios = await prisma.usuario.findMany({
//             select: { id: true, usuario: true },
//         });
//         res.status(200).json(usuarios);
//     } catch (error) {
//         res.status(500).json({ error: "Error al obtener los usuarios." });
//     }
// });

// module.exports = router;
