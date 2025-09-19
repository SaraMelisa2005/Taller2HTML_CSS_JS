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
// Guardar en IndexDB
function guardarPalabras(lista) {
    return new Promise((resolve) => {
        let tx = db.transaction("palabras", "readwrite");
        let store = tx.objectStore("palabras");

        store.clear();

        lista.forEach((p, i) => {
            store.add({ id: i+1, texto: p.toUpperCase() });
        });

        tx.oncomplete = () => {
            resolve();
        };
    });

}
function guardarHistorial(resultado) {
    let fecha = new Date().toLocaleString("es-CO");
    let tx = db.transaction("historial", "readwrite");
    let store = tx.objectStore("historial");
    let req = store.add({
        fecha: fecha,
        resultado: resultado
    });
    req.onsuccess = () => {
        mostrarHistorialMarcador();
    };
}
function mostrarHistorialMarcador() {
    let datos_historial = document.getElementById('datos_historial');
    datos_historial.innerHTML = ""; // limpiar antes de mostrar

    let tx = db.transaction("historial", "readonly");
    let store = tx.objectStore("historial");
    let victorias = document.getElementById('victorias');
    let derrotas = document.getElementById('derrotas');
    let v = 0;
    let d = 0;

    let req = store.getAll();

    req.onsuccess = () => {
        let registros = req.result;
        registros.forEach(r => {
            let fila = document.createElement("tr");

            let tdNum = document.createElement("td");
            tdNum.classList.add("td1");
            tdNum.textContent = r.id;
            
            let tdFecha = document.createElement("td");
            tdFecha.classList.add("td2");
            tdFecha.textContent = r.fecha;

            let tdResultado = document.createElement("td");
            tdResultado.classList.add("td3");
            tdResultado.textContent = r.resultado;

            fila.appendChild(tdNum);
            fila.appendChild(tdFecha);
            fila.appendChild(tdResultado);

            datos_historial.appendChild(fila);

            if (r.resultado === "Victoria") {
                v++;
            }
            else {
                d++;
            }
        });
        victorias.textContent = `${v}`;
        derrotas.textContent = `${d}`;
    };
}

// Al abrir indexDB
request.onsuccess = async function (event) {
    db = event.target.result;
    await guardarPalabras(palabras);

    let posicion = Math.floor(Math.random() * (palabras.length)) + 1;
    await buscarPalabra(posicion);
    mostrarEspacios(palabra);
    mostrarHistorialMarcador();
};
function mostrarEspacios(oculta) {
    let espacios = document.querySelector(".espacios");
    espacios.innerHTML = "";

    for (let i = 0; i < oculta.length; i++) {
        let labelEspacio = document.createElement("label");
        labelEspacio.className = "espacio";
        if (oculta[i] === " ") {
            labelEspacio.textContent = " "; // espacio en blanco
        } else {
            labelEspacio.textContent = "_";   // el guion bajo base
        }

        let labelLetra = document.createElement("label");
        labelLetra.className = "letra";
        labelLetra.textContent = oculta[i]; // letra oculta

        labelEspacio.appendChild(labelLetra);

        espacios.appendChild(labelEspacio);
    }
}

function buscarPalabra(id) {
    return new Promise((resolve) => {
        let tx = db.transaction("palabras", "readonly");
        let store = tx.objectStore("palabras");

        let req = store.get(id);

        req.onsuccess = () => {
            if (req.result) {
                palabra = req.result.texto;
                resolve();
            }
        };
    });
}

let botones = document.querySelectorAll(".botones button");
        botones.forEach((btn) => {
            btn.addEventListener("click", () => {
                validarJuego(palabra, btn);
            });
        });

