let alertDiv = document.getElementById('alert-passw');
const inputPassword = document.getElementById('password');

document.getElementById("showPassword").addEventListener("click", togglePassword);
document.getElementById("opcion5").addEventListener("click", irAadmin);
document.getElementById('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const key = document.getElementById('password').value;
    access(key);
});


inputPassword.addEventListener('click', () => {
    alertDiv.classList.remove('alert-div-error');
    alertDiv.classList.add('alert-div-hidden');
});


async function access(password) {
    try {
        const response = await fetch('https://adsulfwwjlenhqbxwmyo.supabase.co/rest/v1/rpc/obtener_lista_por_clave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc3VsZnd3amxlbmhxYnh3bXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODQzMjcsImV4cCI6MjA0NDM2MDMyN30.gzUiqwnfWMxwKB8s2VH13gE8NKgu92D0ZatnmsPZ-58',

            },
            body: JSON.stringify({ p_clave: password })
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login fallido');
        }

        const dateutc = new Date();
        const ajust = new Date(dateutc.getTime() + (8 * 60 * 60 * 1000) + (20 * 1000)); // Añadir 8 horas y 20 segundos
        const y = ajust.getFullYear();
        const m = ajust.getMonth();
        const d = ajust.getDay();
        const data = await response.json();
        const flag = { Id: 1500, categoria: "$%TYGBHJ", correcta: 3, pregunta: ajust, respuestas: [d, m, y] };
        data[0].lista.push(flag);
        localStorage.setItem('preguntas', JSON.stringify(data[0].lista));
        localStorage.setItem('id_preguntas', JSON.stringify(data[0].id));
        window.location.href = rutaPrincipal;
    } catch (error) {
        alertDiv.classList.remove('alert-div-hidden');
        alertDiv.classList.add('alert-div-error');

    }
}


function togglePassword() {

    let passwordInput = document.getElementById("password");
    let checkbox = document.getElementById("showPassword");
    if (checkbox.checked) {
        passwordInput.type = "text";  // Muestra la contraseña
    } else {
        passwordInput.type = "password";  // Oculta la contraseña
    }
}

document.getElementById("hamburger-btn").addEventListener("click", function () {
    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function (event) {
    const dropdownMenu = document.getElementById("dropdown-menu");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    if (!dropdownMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});

function irAadmin() {
    alert('No se encuentra disponible en esta versión')
}