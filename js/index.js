document.addEventListener("DOMContentLoaded", function () {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const contenedor = document.getElementById("contenedorFormulario");

    btnRegistrar.addEventListener("click", function () {

        contenedor.innerHTML = `
            <h1>Bienvenido al historial de sus tareas</h1>
            <form id="formTarea">
                <label>Ingresa la Fecha</label> <br>
                <input type="date" name="fechaTarea" class="fechaTarea" required>
                <br>
                <label>Ingresa el nombre de la tarea</label> <br>
                <input type="text" name="nombreTarea" class="nombreTarea" required>
                <br>
                <label>Agrega una pequeña descripción de la tarea</label> <br>
                <textarea name="descripcionTarea" id="descripcionTarea" required></textarea>
                <br>
                <button type="submit">Guardar</button>
            </form>
        `;
        const fecha = form.fechaTarea.value;
        const nombre = form.nombreTarea.value;
        const descripcion = form.descripcionTarea.value;
        

        const locStor = (date, titulo, text) => {
            const value = {
                fecha: date,
                titulo: titulo,
                descripcion: text,
            };
        };


        // const form = document.getElementById("formTarea");
        // form.addEventListener("submit", function (event) {
        //     event.preventDefault(); // Evita que se recargue la página

        //     // Obtener los datos del formulario
        //     const fecha = form.fechaTarea.value;
        //     const nombre = form.nombreTarea.value;
        //     const descripcion = form.descripcionTarea.value;

        //     // Puedes guardar o mostrar los datos aquí
        //     console.log("Fecha:", fecha);
        //     console.log("Nombre:", nombre);
        //     console.log("Descripción:", descripcion);

        //     alert("Tarea guardada correctamente");

        //     // Opcional: limpiar formulario
        //     form.reset();
        // });
    });

});



