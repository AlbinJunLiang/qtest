
let tituloExamen = { titulo: "Prepárate para tu examen" };
let capituloExamen = { tema: "Todo" };
let examen = { select: '', contadorCorrectas: 0, pregunta: null };
let mainElement = document.getElementById('main');
const sesionTerminada = {
    terminada: false
};
const container = document.querySelector(".container");
const AVISO = `
¿Deseas guardar tu progreso en el navegador? 🔝\n
1-Estos datos representan solo tu calificación más alta actual. 
2-Pueden ser eliminados en cualquier momento. 
3-Los datos solo son accesibles desde el dispositivo donde se almacenaron.
`;

const buttonComplement = document.querySelectorAll('.button-complement');
let contador = 0;
let timeoutID = null;
let listaPreguntas = [];
const divButtonContainer = document.getElementById('div-button-container');
const divExamen = document.getElementById('div-examenes');
const pTitulo = document.getElementById('titulo');
const parrafo = document.getElementById('parrafo');
let handler;
let listaPreguntasCargadas = []; // Obtiene solo las preguntas a usar para el examen
let divPreguntas = document.getElementById('div-preguntas');
let listaSeleccion = [];
let correctas = 0;


/**
 * Para visualizar la opcion seleccionada
 * 
 * @param {*} selectedDiv 
 * @param {*} index 
 */

function selectOption(selectedDiv, index) {
    let divs = document.getElementsByClassName('options' + index);
    let claseOpcion = '';
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('selected');
        if (divs[i] === selectedDiv) {

            claseOpcion = divs[i].className;
            if (claseOpcion.includes('selecto_')) {
                claseOpcion = claseOpcion.substring(claseOpcion.indexOf('_') + 1, claseOpcion.length);
            }
        }
    }
    selectedDiv.classList.add('selected');
    agregarSeleccion(index, parseInt(claseOpcion)); // Pasar el índice de la pregunta y la opción seleccionada
}


/**
 * Solicita los datos para guardarlo en una estructura
 */

async function fetchAdminData() {
    const preguntaAlmacenadas = localStorage.getItem('preguntas');
    let data = JSON.parse(preguntaAlmacenadas);
    data = data.filter(p => p.Id !== 1500);
    getTopics(data)
    let preguntas = [];
    data.forEach(pregunta => {
        preguntas.push(new Pregunta(pregunta.Id, pregunta.pregunta, pregunta.respuestas, pregunta.correcta, pregunta.categoria));
    });
    return preguntas;
}



/**
 * Permite agrupar las categorias para despues mostrarlas
 * 
 * @param {*} preguntaAlmacenadas 
 * @returns 
 */
function getTopics(preguntaAlmacenadas) {
    const data = preguntaAlmacenadas;
    const categoriasUnicas = Array.isArray(data)
        ? [...new Set(data.map(p => p.categoria).filter(Boolean))]
        : [];
    showTestTopics(categoriasUnicas);
    return categoriasUnicas;
}


function aleatorio() {
    let listaPreguntasFiltradas = listaPreguntas;
    listaPreguntasCargadas = [...listaPreguntasFiltradas];
    pTitulo.textContent = 'Aleatorio';
    agregarTemporizador();
}

/**
 * Muestra los temas seleccionables en la página
 * principal
 * 
 * @param {*} temas 
 */

function showTestTopics(temas) {
    divButtonContainer.innerHTML = "";
    getDetalleCategoria().then(detallesCategoria => {
        temas.forEach(tema => {
            const detalle = detallesCategoria.find(item => item.categoria === tema);

            const boton = document.createElement("button");
            boton.id = tema;
            boton.className = "button-option";

            if (detalle && detalle.imagenUrl) {
                const img = document.createElement("img");
                img.src = detalle.imagenUrl;
                img.alt = "icono";
                img.className = "button-image";
                boton.appendChild(img);
            } else {
                const span = document.createElement("span");
                span.className = "button-image material-symbols-outlined";
                span.style.fontSize = "24px";
                span.textContent = "question_mark";
                boton.appendChild(span);
            }

            const label = document.createElement("b");
            label.textContent = tema;
            boton.appendChild(label);

            boton.addEventListener('click', (event) => {
                const listaPreguntasFiltradas = listaPreguntas.filter(item => item.categoria === event.currentTarget.id);
                listaPreguntasCargadas = [...listaPreguntasFiltradas];

                pTitulo.textContent = event.currentTarget.id;
                agregarTemporizador();
            });
            divButtonContainer.appendChild(boton);
        });

        // ✅ Botón aleatorio sin romper los anteriores
        const botonAleatorio = document.createElement("button");
        botonAleatorio.id = "Aleatorio";
        botonAleatorio.className = "button-option";

        const emoji = document.createElement("p");
        emoji.className = "button-emoji";
        emoji.textContent = "📚";

        const label = document.createElement("b");
        label.textContent = "Preguntas al azar";

        botonAleatorio.appendChild(emoji);
        botonAleatorio.appendChild(label);
        botonAleatorio.addEventListener("click", aleatorio);

        divButtonContainer.appendChild(botonAleatorio);
    });
}

/**
 * Muestra las pregunta en la página
 * 
 * @param {*} listaPreguntasCargadas 
 * @param {*} divPreguntas 
 */
function cargarPreguntas(listaPreguntasCargadas, divPreguntas) {
    let i = 1;
    let respuestas = '';
    listaPreguntasCargadas.forEach(pregunta => {
        respuestas = cargarRespuestas(pregunta.respuestas, i);
        divPreguntas.innerHTML += `    
        <div class="div-questionBox noselect" style='margin-top:20px;'>
        <p class="div-questionText">
          ${i}. ${pregunta.pregunta}
        </p>
        <div>
        ${respuestas}
        </div>
      </div>`;
        i++;
    });
    divPreguntas.innerHTML += `<button id="btn-send" onclick="${send.name}(false)">Enviar</button>`;
    divPreguntas.innerHTML += `<button id="btn-exit" onclick="${goHome.name}()">Salir</button>`;
}

function refresh() {
    window.location.reload()
}


/**
 * Redirige a la pagina principal
 */
function goHome() {
    if (capituloExamen.tema !== 'Todo') {
        if (capituloExamen.tema !== 'Info') {

            let divModalContainer = document.getElementById("div-modalContainer");
            divModalContainer.innerHTML = createModalEvent("5", `¿Estas seguro de que quieres salir?`, "", refresh.name);
            if (window.innerWidth <= 768) {
                setModalWidth("5", "80%");
            } else {
                setModalWidth("5", "20%");
            }
        }else{
            refresh();
        }
        openModal("5");
    } else {


    }

}

function cargarRespuestas(respuestas, idPregunta) {
    let html = '';
    for (let i = 0; i < respuestas.length; i++) {
        let posicionRespuesta = listaPreguntasCargadas[idPregunta - 1].respuestas.indexOf(respuestas[i]);
        html += `<div class="options options${idPregunta} selecto_${posicionRespuesta}" onclick="${selectOption.name}(this, ${idPregunta})"><b>${i + 1}.</b> ${respuestas[i]}</div>`;
    }
    return html;
}


/**
 * Permite visualizar los resultados de las preguntas
 * 
 * @param {*} listaPreguntasCargadas 
 * @param {*} divPreguntas 
 * @param {*} listaSeleccion 
 */
function cargarResultados(listaPreguntasCargadas, divPreguntas, listaSeleccion) {
    let i = 0;
    let resultado = '';
    divPreguntas.innerHTML = '';

    listaPreguntasCargadas.forEach((pregunta, index) => {
        // Verificar si listaSeleccion[index + 1] y listaSeleccion[index + 1].seleccionada existen
        const seleccion = listaSeleccion[index + 1] && listaSeleccion[index + 1].hasOwnProperty('seleccionada')
            ? listaSeleccion[index + 1].seleccionada
            : null; // Valor por defecto si no existe

        resultado = mostrarResultado(index + 1, pregunta.respuestas, seleccion, pregunta);
        divPreguntas.innerHTML += `    
        <div class="div-questionBox noselect">
            <p class="div-questionText">
                ${index + 1}. ${pregunta.pregunta} <br><b class='showAnswer' onclick='${mostrarAnswer.name}()'>Click respuesta...🤔</b>

            </p>
            <div>
            ${resultado}
            </div>

        </div>`;
        i++;
    });
    divPreguntas.innerHTML += `<button id="btn-exit" onclick="${goHome.name}()">Salir</button>`;

}

/***
 * Para mostrar el resultado individualmente a una pregunta
 */
function mostrarResultado(idPregunta, respuestas, seleccionada, preguntaCargada) {
    let html = '';

    for (let i = 0; i < respuestas.length; i++) {
        if ((i === seleccionada)) {
            if (preguntaCargada.correcta === seleccionada) {
                correctas++;
                html += `<div class="options options${idPregunta} result"  style="background-color: rgb(99, 237, 129);"><b>${i + 1}.</b> ${respuestas[i]} ✔️</div>`;



            } else if (seleccionada !== preguntaCargada.correcta) {
                html += `<div class="options options${idPregunta} result" style="background-color: rgb(248, 33, 41);"><b>${i + 1}.</b> ${respuestas[i]} ❌</div>`;
            }
        } else {
            if (preguntaCargada.correcta === i) {
                html += `<div class="options options${idPregunta} result"  style="background-color: rgb(99, 237, 129);"><b>${i + 1}.</b> ${respuestas[i]} ✔️</div>`;

            } else {
                html += `<div class="options options${idPregunta} result" ><b>${i + 1}.</b> ${respuestas[i]}</div>`;

            }
        }
    }
    clearInterval(window.timerInterval);

    return html;
}



function agregarSeleccion(idPregunta, opcionSeleccionada) {
    listaSeleccion[idPregunta] = new Seleccion(idPregunta, opcionSeleccionada);
}

/**
 * 
 * Baraja la lista de preguntas
 * 
 * @param {*} lista 
 * @returns 
 */
function revolver(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]]; // Intercambiar elementos
    }
    return lista;
}


/**
 * Para enviar el examen para que lo evalue
 * @param {*} ignorar 
 */

function send(ignorar) {
    const cantidadPreguntas = parseFloat(listaPreguntasCargadas.length);
    let calificacion = 0;
    let divModalContainer = document.getElementById("div-modalContainer");
    const seleccionados = listaSeleccion.filter(elemento => elemento !== undefined).length;
    if (seleccionados === listaPreguntasCargadas.length || ignorar === true) {
        cargarResultados(listaPreguntasCargadas, divPreguntas, listaSeleccion);
        calificacion = correctas / cantidadPreguntas * 100;
        divModalContainer.innerHTML = createModal("2", `Resultado: ${correctas}/${cantidadPreguntas}`, "");
        setText("2", mostrarCalificacion(calificacion));
        setMargin("2", "5%", "auto", "15%", "auto");

    } else {
        divModalContainer.innerHTML = createModal("2", `Quedan preguntas sin responder`, "");
        setMargin("2", "5%", "auto", "10%", "auto");
    }
    openModal("2");

    if (window.innerWidth <= 768) {
        setModalWidth("2", "80%");
    } else {
        setModalWidth("2", "30%");
    }
}

/**
 * Para mostrar el resultado de la calificacion
 * 
 * @param {*} calificacion 
 * @returns 
 */
function mostrarCalificacion(calificacion) {
    calificacion = redondearNumero(calificacion, 2);
    let salida = "";
    if (calificacion > 70) {
        salida = `Aprobado: <b>${calificacion}</b>`
    } else {
        salida = `Reprobado: <b>${calificacion}</b>`
    }
    return salida;
}

/**
 * Crea el componente de temporizador
 * @param {*} contenedor 
 */

function crearTemporizador(contenedor) {
    const container = document.getElementById(contenedor);
    const content = `
 <div id="myConfigModal" class="configModal" style="  overflow: hidden;">
    <div class="modal-content">
      <span class="close" onclick="${closeModal.name}('myConfigModal')">&times;</span>
      <h2>Configurar Temporizador</h2>
      <form id="timer-form">
        <label for="unit">Selecciona la unidad:</label>
        <select id="unit">
          <option value="hours">Horas</option>
          <option value="minutes">Minutos</option>
          <option value="seconds">Segundos</option>
        </select>
        <div id="time-inputs">
          <!-- Campos de entrada se agregarán aquí -->
        </div>
        <div class="slider-container">
          <label for="number-slider">Preguntas:</label>
          <input type="range" id="number-slider" min="1" max="${listaPreguntasCargadas.length}" value="${listaPreguntasCargadas.length}">
          <p>Cantidad de preguntas: <span id="slider-value">5</span></p>
        </div>
        <button type="button" class="acceptBtn" onclick="${configTimer.name}()">Iniciar</button>
        <button type="button" class="cancelBtn" onclick="${closeModal.name}('myConfigModal')">cancelar</button>
      </form>
    </div>
  </div>
    `;
    container.innerHTML = content;

    // Agregar event listeners después de agregar el contenido al DOM
    document.getElementById("unit").addEventListener("change", function () {
        const unit = this.value;
        const timeInputs = document.getElementById("time-inputs");
        timeInputs.innerHTML = ""; // Limpiar campos existentes

        let html = "";

        if (unit === "hours") {
            html += '<div class="div-input"><label for="hours">Horas:</label>';
            html += '<input type="number" id="hours" min="0" value="0"></div>';
            html += '<div class="div-input"><label for="minutes">Minutos:</label>';
            html += '<input type="number" id="minutes" min="0" value="40"></div>';
        } else if (unit === "minutes") {
            html += '<div class="div-input"><label for="minutes">Minutos:</label>';
            html += '<input type="number" id="minutes" min="0" value="40"></div>';
            html += '<div class="div-input"><label for="seconds">Segundos:</label>';
            html += '<input type="number" id="seconds" min="0" value="0"></div>';
        } else if (unit === "seconds") {
            html += '<div class="div-input"><label for="seconds">Segundos:</label>';
            html += '<input type="number" id="seconds" min="0" value="60"></div>';
        }

        timeInputs.innerHTML = html;
    });

    // Inicializar el slider y el valor mostrado
    const slider = document.getElementById('number-slider');
    const valueDisplay = document.getElementById('slider-value');
    valueDisplay.textContent = slider.value;

    slider.addEventListener('input', () => {

        valueDisplay.textContent = slider.value;

    });

    // Disparar el evento 'change' en el elemento con id 'unit'
    const unitElement = document.getElementById("unit");
    if (unitElement) {
        unitElement.dispatchEvent(new Event('change'));
    }
}

function agregarTemporizador() {
    crearTemporizador("div-modalContainer");
    openModal("myConfigModal");
}

{

    const preguntaAlmacenadastemp = localStorage.getItem('preguntas');
    if (preguntaAlmacenadastemp) {
        let datatemp = JSON.parse(preguntaAlmacenadastemp);
        let dateaction = datatemp.find(p => p.categoria === '$%TYGBHJ');
        const ingresada = new Date(dateaction);
        const dateactual = new Date();
        const diferencia = Math.abs(dateactual - ingresada);
        const diferenciaHoras = diferencia / (1000 * 60 * 60);
        if (diferenciaHoras > 36) {
            mainElement.innerHTML = '<h2>401 No Disponible</h2>';
            window.location.href = rutaAcceso;
            localStorage.removeItem('preguntas');
        }
    } else {

        localStorage.removeItem('preguntas');
        mainElement.innerHTML = '<h2>401 No Disponible</h2>';
        window.location.href = rutaAcceso;
    }
}

/**
 * Para ajustar el temporizador
 */

function configTimer() {
    const unit = document.getElementById("unit").value;
    let totalSeconds = 0;

    if (unit === "hours") {
        const hours = parseInt(document.getElementById("hours")?.value || 0);
        const minutes = parseInt(document.getElementById("minutes")?.value || 0);
        totalSeconds = (hours * 3600) + (minutes * 60);
    } else if (unit === "minutes") {
        const minutes = parseInt(document.getElementById("minutes")?.value || 0);
        const seconds = parseInt(document.getElementById("seconds")?.value || 0);
        totalSeconds = (minutes * 60) + seconds;
    } else if (unit === "seconds") {
        const seconds = parseInt(document.getElementById("seconds")?.value || 0);
        totalSeconds = seconds;
    }

    // Añadir el valor del slider al total de segundos (suponiendo que cada pregunta es 1 minuto)
    const sliderValue = parseInt(document.getElementById("number-slider").value);
    listaPreguntasCargadas = listaPreguntasCargadas.slice(0, parseInt(sliderValue));

    for (let i = 0; i < listaPreguntasCargadas.length; i++) {
        shuffleOptions(listaPreguntasCargadas[i]);
    }

    document.getElementById("myConfigModal").style.display = "none";
    startCountdown(totalSeconds, unit);
    cargarPreguntas(listaPreguntasCargadas, divPreguntas);
    capituloExamen.tema = "tema";
    divExamen.style.display = 'none';
    divPreguntas.style.display = 'block';
    parrafo.innerHTML = "Se considera aprobado este temario con la condición de que la nota sea mayor o igual a 70 y es necesario contestar todas las preguntas para que se pueda mostrar la calificación.";
}

/**
 * Para inicializar el temporizador
 * @param {*} totalSeconds 
 * @param {*} unit 
 */

function startCountdown(totalSeconds, unit) {
    const countdownElement = document.getElementById("countdown");
    countdownElement.innerHTML = "Iniciando el temporizador...";

    window.timerInterval = setInterval(function () {
        if (totalSeconds <= 0) {
            clearInterval(window.timerInterval);
            countdownElement.innerHTML = "¡Tiempo terminado!";
            send(true);
            return;
        }
        totalSeconds--;
        updateCountdownDisplay(totalSeconds, unit);
    }, 1000);
}


/**
 * Para actualizar el temporizador
 * @param {*} seconds 
 * @param {*} unit 
 */

function updateCountdownDisplay(seconds, unit) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const countdownElement = document.getElementById("countdown");
    if (unit === 'hours') {
        if (hours === 0) {
            countdownElement.innerHTML = `${minutes}m ${secs}s`;
        } else {
            countdownElement.innerHTML = `${hours}h ${minutes}m ${secs}s`;
        }
    } else if (unit === 'minutes') {
        if (minutes === 0) {
            countdownElement.innerHTML = `${secs}s`;
        } else {
            countdownElement.innerHTML = `${minutes}m ${secs}s`;
        }
    } else if (unit === 'seconds') {
        countdownElement.innerHTML = `${secs}s`;
    }
}


/**
 * Baraja las opciones
 * @param {*} pregunta 
 */

function shuffleOptions(pregunta) {
    let opciones = pregunta.respuestas.map((elemento) => elemento.trim()),
        respuestaCorrecta = opciones[pregunta.correcta];
    opciones = revolver(opciones);
    let nuevaCorrecta = opciones.indexOf(respuestaCorrecta);
    (pregunta.respuestas = opciones), (pregunta.correcta = nuevaCorrecta);
}




// Define la función que se ejecutará cuando un botón sea clicado


/**
 * Crea la estructura de una pregunta
 */
function generateQuestion(contador, pregunta, respuestas) {
    divPreguntas.innerHTML = `    
    <div class="div-questionBox noselect">
    <p class="div-questionText">
      ${contador}. ${pregunta.pregunta}
    </p>
    <div>
    ${respuestas}
    </div>
  </div>`;
}




function mostrarAnswer() {
    Swal.fire({
        title: 'Opción en desarrollo',
        text: 'No disponible y se encuentra en proceso',
        showClass: { popup: '' },
        hideClass: { popup: '' }
    });

}


/**
 * Permite ir al espacion de la información de la página
 */
function irAinfo() {
    if (navigator.onLine) {
        capituloExamen.tema = "Info";

        container.style.display = 'none';
        pTitulo.innerHTML = "Información de la página";
        parrafo.innerHTML = "Podrás conocer algunos detalles, funcionamiento de la página y sus características. ✅";
        divExamen.style.display = 'none';
        article1.style.alignItems = 'center';
        article1.style.textAlign = 'center';
        article2.style.display = 'block';
        divExamen.style.display = 'none';
        document.getElementById("countdown").style.display = 'none';
        document.getElementById('btn-next').style.display = 'none';
        divPreguntas.innerHTML = '';
    }
}


/**
 * Muestra información básica de la página (Titulo, color y etc)
 */
function reemplazarDatosPagina() {
    const elemento = document.getElementById('titulo-principal');
    elemento.innerHTML = "<p>Qtest✔</p>"; // Reemplaza con el texto que desees
    elemento.style.color = 'rgb(234, 201, 13)'; // Cambiar el color del texto
}

/**
 * Mostrar acceso no disponible
 */
function showNotAccess() {
    localStorage.removeItem('id_preguntas');
    localStorage.removeItem('preguntas');
    mainElement.innerHTML = '<h2>401 No Disponible</h2>';
    window.location.href = rutaAcceso;
}


/**
 * Eliminar la sesion
 */
function logout() {
    let divModalContainer = document.getElementById("div-modalContainer");
    divModalContainer.innerHTML = createModalEvent("5", `¿Cerrar sesión?`, "", showNotAccess.name);
    if (window.innerWidth <= 768) {
        setModalWidth("5", "80%");

    } else {
        setModalWidth("5", "20%");

    }
    openModal("5");
}


/**
 * Verfica si la fecha limite de sesion haya transcurrido
 * 
 * @param {*} fecha 
 */
function verificarSiHaTranscurrido(fecha) {
    calcularDiferenciaHoras(fecha);
    const fechaActual = new Date();
    const fechaIngresada = new Date(fecha);

    if (fechaIngresada < fechaActual) {
        mainElement.innerHTML = '<h2>401 No Disponible</h2>';
        window.location.href = rutaAcceso;
        localStorage.removeItem('preguntas');

    } else if (fechaIngresada > fechaActual) {
    } else {
        mainElement.innerHTML = '<h2>401 No Disponible</h2>';
        window.location.href = rutaAcceso;
        localStorage.removeItem('preguntas');

    }
}


/**
 * Retorna la diferencia de horas que hay entre dos fechas
 * 
 * @param {*} dateaction 
 * @returns 
 */
function calcularDiferenciaHoras(dateaction) {
    const ingresada = new Date(dateaction);
    const dateactual = new Date();
    const diferencia = Math.abs(dateactual - ingresada);
    const diferenciaHoras = diferencia / (1000 * 60 * 60);
    if (diferenciaHoras > 36) {
        mainElement.innerHTML = '<h2>401 No Disponible</h2>';
        window.location.href = rutaAcceso;
        localStorage.removeItem('preguntas');
        return 36; // Retornamos el valor máximo de 5 horas
    }
    return diferenciaHoras;
}



function redondearNumero(numero, decimales) {
    return Number(numero.toFixed(decimales));
}

document.addEventListener('DOMContentLoaded', async () => {
    listaPreguntas = await fetchAdminData();
    listaPreguntas = revolver(listaPreguntas);
    listaPreguntasCargadas = [...listaPreguntas];
});



document.getElementById("opcionLogout").addEventListener("click", logout);
document.getElementById("opcionInfo").addEventListener("click", irAinfo);
document.getElementById("opcionSalir").addEventListener("click", goHome);

/**
 * Para el boton de hamburguesas
 */
document.getElementById("hamburger-btn").addEventListener("click", function () {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});


/**
 *  Incializar las opciones del boton como none
 */
document.addEventListener("click", function (event) {
    const dropdownMenu = document.getElementById("dropdown-menu");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    if (!dropdownMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});


if (navigator.onLine) {
    reemplazarDatosPagina();
}


