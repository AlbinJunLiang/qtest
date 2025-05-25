function Pregunta(Id, pregunta, respuestas, correcta, categoria) {
    this.Id = Id;
    this.pregunta = pregunta;
    this.respuestas = respuestas;
    this.correcta = correcta;
    this.categoria = categoria;
}

/**
 * Para crear una lista y guardar la respuesta seleccionada 
 * 
 * @param {*} idPregunta 
 * @param {*} seleccionada 
 */
function Seleccion(idPregunta, seleccionada) {
    this.idPregunta = idPregunta;
    this.seleccionada = seleccionada;
}