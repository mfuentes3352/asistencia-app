const fs = require("fs");

const texto = fs.readFileSync("alumnos.csv", "utf-8");

const lineas = texto.split("\n");

const alumnos = [];

lineas.forEach((linea, index) => {

    if (!linea.trim()) return;

    // Separar solo la primera coma (legajo del resto)
    const primeraComa = linea.indexOf(",");

    let legajo = linea.slice(0, primeraComa).trim();

if (legajo === "Sin definir" || legajo === "") {
    legajo = null;
}
    let resto = linea.slice(primeraComa + 1).trim();

    // Sacar comillas si existen
    resto = resto.replace(/^"|"$/g, "");

    // Separar apellido y nombre
    const partes = resto.split(",");

    const apellido = partes[0].trim();
    const nombre = partes[1] ? partes[1].trim() : "";

    alumnos.push({
        id: index + 1,
        legajo,
        apellido,
        nombre,
        presente: false
    });
});

fs.writeFileSync(
    "alumnos.json",
    JSON.stringify(alumnos, null, 2)
);

console.log(alumnos);