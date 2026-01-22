// 1. Importaciones necesarias (Usando la versión CDN para que funcione en el navegador)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Tu configuración real (Ya la incluí aquí)
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 4. FUNCIONES PARA EL HTML (window.nombre hace que el HTML las vea) ---

// Registrarse como nuevo Admin
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (pass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");

    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta de administrador creada!");
    } catch (e) {
        alert("Error al registrar: " + e.message);
    }
};

// Iniciar Sesión
window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
        alert("Error al entrar: " + e.message);
    }
};

// Cerrar Sesión
window.logout = () => signOut(auth);

// Guardar los datos del torneo en la nube
window.crearTorneo = async () => {
    const nombreT = document.getElementById('nombreTorneo').value;
    if (!nombreT) return alert("Escribe un nombre para el torneo antes de guardar");
    
    const datosLocales = JSON.parse(localStorage.getItem('torneo_data')) || { equipos: [] };

    try {
        await setDoc(doc(db, "torneos", nombreT), {
            config: datosLocales,
            propietario: auth.currentUser.email,
            fecha: new Date().toISOString()
        });
        alert("¡Torneo guardado exitosamente en Firebase!");
    } catch (e) {
        alert("Error al guardar en la nube: " + e.message);
    }
};

// --- 5. VIGILANTE DE SESIÓN ---
onAuthStateChanged(auth, (user) => {
    // Esta función llama a 'cambiarModo' que debe estar en tu HTML
    if (window.cambiarModo) {
        window.cambiarModo(user);
    }
});
