let palabras = [
    "javascript",
    "programacion",
    "sistemas",
    "visual studio",
    "visual basic",
    "python",
    "github",
    "indexdb",
    "desarrollo",
    "animaciones"
];

let palabra = "";
let db;
let request = indexedDB.open("ahorcado", 2); // version 2
let contNoEncontrado = contEncontrado = 0;
let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Crear tabla IndexDB
request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (db.objectStoreNames.contains("palabras")) {
        db.deleteObjectStore("palabras");
    }

    db.createObjectStore("palabras", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("historial", { keyPath: "id", autoIncrement: true });
};

