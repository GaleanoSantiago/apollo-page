// Lógica de Autenticación
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loginBtn.disabled = true;
        loginBtn.textContent = 'Verificando...';
        loginError.classList.add('d-none');

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login exitoso
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Ingresar';
                loginError.textContent = "Error: " + error.message;
                loginError.classList.remove('d-none');
            });
    });
}

// Función de Logout (para dashboard)
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

// Verificar estado de sesión (para proteger páginas)
// Solo se ejecuta si NO estamos en el login
if (!document.getElementById('loginForm')) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            // Si hay elementos de usuario en la UI, actualizarlos
            const userEmailEl = document.getElementById('userEmail');
            if(userEmailEl) userEmailEl.textContent = user.email;
            
            // Si estamos en dashboard, cargar contratos
            if(typeof loadContracts === 'function') {
                loadContracts(user);
            }
        }
    });
}
