
/**
 * Obtiene la categorias por medio de un servicio
 * @returns 
 */

function getDetalleCategoria() {
    let id = localStorage.getItem('id_preguntas');
    return fetch(`https://adsulfwwjlenhqbxwmyo.supabase.co/rest/v1/detalleCategoria?idExamen=eq.${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc3VsZnd3amxlbmhxYnh3bXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODQzMjcsImV4cCI6MjA0NDM2MDMyN30.gzUiqwnfWMxwKB8s2VH13gE8NKgu92D0ZatnmsPZ-58',
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la solicitud');
            return response.json();
        })
        .then(data => {
            console.log('✅ Datos recibidos:', data);
            return data;
        })
        .catch(error => {
            console.error('❌ Error:', error);
            throw error;
        });
}