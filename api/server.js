import { createClient } from "@supabase/supabase-js";
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

const supabase = createClient(
    'https://sbtpajhevouznzwsblsi.supabase.co/', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHBhamhldm91em56d3NibHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDM3ODEsImV4cCI6MjA1NDYxOTc4MX0.BUU7EZu6tYoZC26z68TAR8f9yezz3A-Di8oPfr09fXA' 
);

const app = express();

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
        const { data: existingUser } = await supabase
            .from('usuario')
            .select('usuario')
            .eq('usuario', usuario)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const { data: nuevoUsuario, error: insertError } = await supabase
            .from('usuario')
            .insert([{ usuario, contrasena: hashedPassword }]);

        if (insertError) {
            throw insertError;
        }

        res.status(201).json({
            message: "Usuario registrado con éxito.",
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
        const { data: user, error } = await supabase
            .from('usuario') 
            .select('*') 
            .eq('usuario', usuario) 
            .single();

        if (error) {
            console.error("Error al buscar el usuario:", error);
            return res.status(500).json({ error: "Error al buscar el usuario." });
        }

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        if (!await bcrypt.compare(contrasena, user.contrasena)) {
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

export default app;
