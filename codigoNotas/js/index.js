//crea e inserta el formulario en el contenedor
function crearFormulario(contenedor) {
    contenedor.innerHTML = "";//para que tome que el resto es un html

    //Titulo
    const h1 = document.createElement("h1");
    h1.textContent = "Bienvenidos al historial de sus tareas";
    contenedor.appendChild(h1);

    //Formulario
    const form = document.createElement("form");
    form.id = "formTarea";

    //campos del formulario
    const labelFecha = document.createElement("label");
    labelFecha.textContent = "Ingresa la Fecha";
    const inputFecha = document.createElement("input");
    inputFecha.type = "date";
    inputFecha.name = "fechaTarea";
    inputFecha.required = true;//verificacion de que el usuario llene el formulario

    const labelNombre = document.createElement("label");
    labelNombre.textContent = "Ingresa el nombre de la tarea";
    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.name = "nombreTarea";
    inputNombre.required = true;

    const labelDesc = document.createElement("label");
    labelDesc.textContent = "Agrega una pequeña descipción de la tarea";
    const textareaDec = document.createElement("textarea");
    textareaDec.name = "descripcionTarea";
    textareaDec.required = true;

    //boton guardar
    const btnGuardar = document.createElement("button");
    btnGuardar.type = "submit";
    btnGuardar.textContent = "Guardar";

    //Montar elementos en el formulario
    form.append(
        labelFecha, document.createElement("br"),
        inputFecha, document.createElement("br"),
        labelNombre, document.createElement("br"),
        inputNombre, document.createElement("br"),
        labelDesc, document.createElement("br"),
        textareaDec, document.createElement("br"),
        btnGuardar
    );

    form.addEventListener("submit", (ev) =>
        guardarTarea(ev, contenedor, inputFecha, inputNombre, textareaDec));
    contenedor.appendChild(form);
}
//Guardar la tarea en localStorage en una clave unica
function guardarTarea(ev, contenedor, inputFecha, inputNombre, textareaDec){
    ev.preventDefault();
    //inicio de localstorage
    //crear objeto tarea
    const tarea = {
        fecha: inputFecha.value,
        nombre: inputNombre.value,
        descripcion: textareaDec.value,
        completada: false,
    };
    //calcular el proximo indice
    const numTareas = Object.keys(localStorage)
    .filter((k)=>k.startsWith("tarea"))
    .length + 1;

    const clave = "tarea" + numTareas;
    //guardar en localStorage
    localStorage.setItem(clave, JSON.stringify(tarea));
    alert(`Tarea guardada correctamente como ${clave}`);
    //limpiar formulario y ocultar el contenedor 
    ev.target.reset();
    contenedor.innerHTML = "";
}
//inicializa los eventos al cargar la pagina
function inicializar() {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const contenedor = document.getElementById("contenedorFormulario");
    btnRegistrar.addEventListener("click", () => {
        crearFormulario(contenedor);
    });
}
//inicio
inicializar();
//visualizar las tareas registradas y orden cronologico
// Función para guardar una tarea en localStorage
function guardarTarea(ev, contenedor, inputFecha, inputNombre, textareaDec) {
    ev.preventDefault();

    const tarea = {
        fecha: inputFecha.value,
        nombre: inputNombre.value,
        descripcion: textareaDec.value,
        completada: false,
    };

    // Obtener el siguiente índice para la clave
    const numTareas = Object.keys(localStorage)
        .filter((k) => k.startsWith("tarea"))
        .length + 1;

    const clave = "tarea" + numTareas;

    // Guardar la tarea en localStorage (corregido)
    localStorage.setItem(clave, JSON.stringify(tarea));

    alert(`Tarea guardada correctamente como ${clave}`);

    ev.target.reset();
    contenedor.innerHTML = "";

    // Actualizar la visualización de tareas
    mostrarTareas();
}

// Función para mostrar las tareas ordenadas por fecha
function mostrarTareas() {
    // Crear o seleccionar el contenedor donde mostrar las tareas
    let contenedorTareas = document.getElementById("contenedorTareas");
    if (!contenedorTareas) {
        contenedorTareas = document.createElement("div");
        contenedorTareas.id = "contenedorTareas";
        document.body.appendChild(contenedorTareas);
    }

    contenedorTareas.innerHTML = ""; // Limpiar contenido previo

    // Obtener todas las tareas de localStorage
    const tareas = Object.keys(localStorage)
        .filter((clave) => clave.startsWith("tarea"))
        .map((clave) => JSON.parse(localStorage.getItem(clave)));

    // Ordenar por fecha (de más antigua a más reciente)
    tareas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Mostrar cada tarea
    tareas.forEach((tarea, index) => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.margin = "5px";
        div.style.padding = "5px";

        div.innerHTML = `
            <strong>Fecha:</strong> ${tarea.fecha} <br>
            <strong>Nombre:</strong> ${tarea.nombre} <br>
            <strong>Descripción:</strong> ${tarea.descripcion} <br>
            <strong>Completada:</strong> ${tarea.completada ? "Sí" : "No"}
        `;

        contenedorTareas.appendChild(div);
    });
}

// Inicializar eventos y mostrar tareas al cargar la página
function inicializar() {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const contenedor = document.getElementById("contenedorFormulario");

    btnRegistrar.addEventListener("click", () => {
        crearFormulario(contenedor);
    });

    // Mostrar tareas guardadas al cargar la página
    mostrarTareas();
}

// Llamar a inicializar al cargar el script
inicializar();

//diferenciar las tareas completadas y las pendientes
//elimar tareas
//buscador de tareas
//total de tareas completadas y pendientes