const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Cargar alumnos desde JSON
let alumnos = JSON.parse(fs.readFileSync("alumnos.json", "utf-8"));


// 1. Obtener lista completa
app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});


// 2. Marcar asistencia
app.post("/asistencia", (req, res) => {
    const { id } = req.body;

    const alumno = alumnos.find(a => a.id === id);

    if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado" });
    }

    if (alumno.presente) {
        return res.json({ mensaje: "Ya estaba presente" });
    }

    alumno.presente = true;

    // Guardar cambios
    fs.writeFileSync("alumnos.json", JSON.stringify(alumnos, null, 2));

    res.json({ mensaje: "Asistencia registrada" });
});


// 3. Ver estado
app.get("/estado", (req, res) => {
    const presentes = alumnos.filter(a => a.presente);
    const ausentes = alumnos.filter(a => !a.presente);

    res.json({ presentes, ausentes });
});

app.get("/tabla", (req, res) => {
    const tabla = alumnos.map(a => ({
        nombre: a.apellido + ", " + a.nombre,
        estado: a.presente ? "Presente" : "Ausente"
    }));

    res.json(tabla);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tabla-view", (req, res) => {
    res.sendFile(path.join(__dirname, "tabla.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor corriendo en puerto", PORT);
});