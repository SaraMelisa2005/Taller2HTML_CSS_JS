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
    alert(`Tarea guardada correctamente como  ${clave}`);
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
//elimar tareas
//diferenciar las tareas completadas y las pendientes
//buscador de tareas
//total de tareas completadas y pendientes