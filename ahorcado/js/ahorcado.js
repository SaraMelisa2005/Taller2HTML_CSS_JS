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

let db;//variable que controla la base de datos
let request = indexedDB.open("ahorcado", 1);//darle acceso a indexdb,1 es para acceder
let palabra ="";

// Crear tabla IndexDB
request.onupgradeneeded = function (event) {//crear la tabla de la BD
    db = event.target.result;

    if (db.objectStoreNames.contains("palabras")) {
        db.deleteObjectStore("palabras");//limpia la informacion de la bd
    }

    db.createObjectStore("palabras", { keyPath: "id", autoIncrement: true });//crea la tabla
    //la escructura
};



// Guardar en IndexDB
function guardaPalabras(lista) {//el arreglo palabras se recibe en la variable lista
    return new Promise((resolve) => {//envia un mensaje al await
        let tx = db.transaction("palabras", "readwrite");//
        let store = tx.objectStore("palabras");//toma la tabla y la recorre como un objeto

        store.clear();//elimina cualquier palabra que este en esa tabla

        lista.forEach((p, i) => {//p1:el value es decir cada una de las palabras p2:ajusta el id del arreglo
            store.add({ id: i+1, texto: p });//va agregando a la tabla de la base de datos los valores
        });

        tx.oncomplete = () => {//si ya completo de llenar la tabla
            
            resolve();//le dice al await que ya puede continuar ejecutandose
        };
    });
}

// Al abrir indexDB
//si logra abrir la BD
request.onsuccess = async function (event) {
    db = event.target.result;//captura los reultados de la bases de datos
    await guardaPalabras(palabras);//espera hasta que la funcion termine

    let posicion = Math.floor(Math.random() * (palabras.length)) + 1;
    buscarPalabra(posicion);
};

function buscarPalabra(id) {
    let tx = db.transaction("palabras", "readonly");//solo lectura
    let store = tx.objectStore("palabras");//acceso a la tabla palabras

    let req = store.get(id);//extraiga la informacion donde la clave primaria sea el id

    req.onsuccess = () => {
        

        if (req.result) {//pregunta si hay datos es decir si la encontro 
             palabra = req.result.texto;
            console.log("Palabra seleccionada con", id, 'es', palabra);
        }
    };
}





