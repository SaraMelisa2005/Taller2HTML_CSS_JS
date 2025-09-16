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

    alert(`fTarea guardada correctamente como ${clave}`);

    ev.target.reset();
    contenedor.innerHTML = "";

    // Actualizar la visualización de tareas
    mostrarTareas();
}
//visualizar las tareas registradas y orden cronologico
// Función para mostrar las tareas ordenadas por fecha
function mostrarTareas(filtro = "") {//se agrego el parametro
    // Crear o seleccionar el contenedor donde mostrar las tareas
    let contenedorTareas = document.getElementById("contenedorTareas");
    if (!contenedorTareas) {
        contenedorTareas = document.createElement("div");
        contenedorTareas.id = "contenedorTareas";
        document.body.appendChild(contenedorTareas);
    }

    contenedorTareas.innerHTML = ""; // Limpiar contenido 

    // Obtener todas las tareas de localStorage
    let tareas = Object.keys(localStorage)
        .filter((clave) => clave.startsWith("tarea"))
       //se cambia esto para que cada tarea sea un objeto que incluye su clave.para el check
        .map((clave) => ({ clave, ...JSON.parse(localStorage.getItem(clave)) }));


    // Ordenar por fecha (de más antigua a más reciente)
    tareas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    // // Filtrar si hay texto de búsqueda
    if (filtro) {
        tareas = tareas.filter((tarea) =>
            tarea.nombre.toLowerCase().includes(filtro) ||
            tarea.descripcion.toLowerCase().includes(filtro)
        );
    }
    //contadores
    // Contadores
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;
    // Crear resumen
    const resumen = document.createElement("div");
    resumen.innerHTML = `
        <h3>Resumen de tareas</h3>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Completadas:</strong> ${completadas}</p>
        <p><strong>Pendientes:</strong> ${pendientes}</p>
    `;
    contenedorTareas.appendChild(resumen)
    // Secciones
    const secPendientes = document.createElement("div");
    const secCompletadas = document.createElement("div");

    secPendientes.innerHTML = "<h3>📌 Tareas Pendientes</h3>";
    secCompletadas.innerHTML = "<h3>✅ Tareas Completadas</h3>";


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
        
    `//de aqui se elimino el texto plano
    ;
    // Crear el checkbox de completada
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = tarea.completada; // refleja el estado guardado
checkbox.id = `check-${tarea.clave}`; // id único para accesibilidad

// Crear etiqueta asociada al checkbox
const labelCheck = document.createElement("label");
labelCheck.htmlFor = checkbox.id;
labelCheck.textContent = "Completada";
//para que se muestre el check
     div.appendChild(labelCheck);
    div.appendChild(checkbox);
    contenedorTareas.appendChild(div);

    //para que se escuche el evento del check
    checkbox.addEventListener("change", () => {
    // aqui se Actualizo el valor en el objeto
    tarea.completada = checkbox.checked;
     mostrarTareas(); // Actualiza la lista y los contadores en tiempo real

    // aqui se Guarda otra vez en localStorage con la misma clave
    localStorage.setItem(tarea.clave, JSON.stringify(tarea));

});
   
    


    // crea el boton de eliminar en cada una de las tareas
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";

    // acción que hace el boton de eliminar
    btnEliminar.addEventListener("click", () => {
        const claves = Object.keys(localStorage).filter((clave) =>
            clave.startsWith("tarea")
        );
        // Eliminar la tarea correspondiente
        localStorage.removeItem(claves[index]);
        mostrarTareas(); // actualizar la lista
    });

    div.appendChild(btnEliminar);
});
   
}
//funcion crear barra de busquedas por nombre
function crearBuscador() {
    // Verificar si ya existe para no duplicarlo
    let contenedorBuscador = document.getElementById("contenedorBuscador");
    if (contenedorBuscador) return; // ya existe, no lo crea de nuevo

    // Crear el contenedor
    contenedorBuscador = document.createElement("div");
    contenedorBuscador.id = "contenedorBuscador";

    // Título
    const titulo = document.createElement("h2");
    titulo.textContent = "Buscar tareas";

    // Input de búsqueda
    const inputBuscar = document.createElement("input");
    inputBuscar.type = "text";
    inputBuscar.placeholder = "Escribe para filtrar tareas...";

    // Insertar todo en el contenedor
    contenedorBuscador.appendChild(titulo);
    contenedorBuscador.appendChild(inputBuscar);

    // Insertarlo en la página, antes de la lista de tareas
    document.body.insertBefore(contenedorBuscador, document.getElementById("contenedorTareas"));

    // Agregar evento: cada vez que escriba, filtramos
    inputBuscar.addEventListener("input", (ev) => {
        const texto = ev.target.value.toLowerCase();
        mostrarTareas(texto); // pasamos el texto a mostrarTareas
    });
}


// Inicializar eventos y mostrar tareas al cargar la página
function inicializar() {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const contenedor = document.getElementById("contenedorFormulario");
    
    btnRegistrar.addEventListener("click", () => {
        crearFormulario(contenedor);
    });
    //llama a la funcion buscar
    crearBuscador();   

    // Mostrar tareas guardadas al cargar la página
    mostrarTareas();
    
}

// Llamar a inicializar al cargar el script
inicializar();
