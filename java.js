function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var togglePassword = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Ocultar";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Mostrar";
    }
}

function validarFormulario() {
    var usuarioInput = document.getElementById("usuario");
    var passwordInput = document.getElementById("password");

    // Solo se aceptan números en el campo de usuario
    var regexNumeros = /^\d+$/;
    if (!regexNumeros.test(usuarioInput.value)) {
        alert("El campo de usuario solo acepta números.");
        return false;
    }

    //  Los campos no pueden estar vacíos
    if (usuarioInput.value.trim() === "" || passwordInput.value.trim() === "") {
        alert("Por favor, complete todos los campos.");
        return false;
    }

    // Mandar a "consultar.html"
    window.location.href = "consultar.html";
    return false;
}

if (typeof flatpickr !== 'undefined') {

    flatpickr("#fecha", {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
    });
} else {
    console.error("Flatpickr is not defined. Make sure the script is loaded correctly.");
}
// Mostrar u ocultar
document.getElementById('contenidoArchivo').style.display = 'none';


document.getElementById('consultaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var archivoTXT = 'ejtick.txt'; // Ruta al archivo de texto

    fetch(archivoTXT)
        .then(response => response.text())
        .then(data => {
            var contenidoArchivo = document.getElementById('archivoContenido');
            var contenedorArchivo = document.getElementById('contenidoArchivo');

            if (data && data.trim() !== "") {

                contenidoArchivo.textContent = data; // Mostrar contenido sin modificar

                contenidoArchivo.setAttribute('data-original', data);
                contenedorArchivo.style.display = "block";
            } else {
                alert("El archivo está vacío o no se encontró.");
                contenedorArchivo.style.display = "none";
            }
        })
        .catch(error => console.error('Error al obtener el archivo:', error));
});

// Función para resaltar coincidencias y mostrar coincidencias
function resaltarYFiltrarTickets(contenidoCompleto, termino) {

    var tickets = contenidoCompleto.split(/\*{80,}/g);//separador
    var ticketsFiltrados = "";


    tickets.forEach((ticket) => {

        if (ticket.toLowerCase().includes(termino.toLowerCase())) {
            // Resaltar el término dentro del ticket
            var ticketResaltado = ticket.replace(
                new RegExp(`(${termino})`, 'gi'),
                '<span class="resaltado">$1</span>'
            );


            ticketsFiltrados += `*****************************************************************************************<br>${ticketResaltado}<br>*****************************************************************************************<br><br>`;
        }
    });

    // Mostrar un mensaje si no hay coincidencias
    return ticketsFiltrados || "No se encontraron coincidencias.";
}


document.getElementById('buscarBtn').addEventListener('click', function (event) {
    event.preventDefault();

    var contenidoArchivo = document.getElementById('archivoContenido');
    var term = document.getElementById('miBuscador').value.toLowerCase();


    var textoOriginal = contenidoArchivo.getAttribute('data-original');

    contenidoArchivo.innerHTML = '';

    // Si el campo de búsqueda está vacío, mostrar todo el contenido original
    if (term === "") {
        contenidoArchivo.innerHTML = textoOriginal.replace(/\n/g, '<br>');
    } else {
        // Si hay un término de búsqueda, filtrar los resultados
        var resultado = resaltarYFiltrarTickets(textoOriginal, term);
        contenidoArchivo.innerHTML = resultado; // Mostrar los tickets filtrados
    }
});
