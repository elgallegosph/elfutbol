// Importaciones desde la CDN de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tus credenciales reales que proporcionaste
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- FUNCIONES GLOBALES PARA EL HTML ---

window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada correctamente!");
    } catch (e) {
        alert("Error al registrar: " + e.message);
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("Sesión iniciada");
    } catch (e) {
        alert("Error al entrar: " + e.message);
    }
};

window.logout = () => signOut(auth);

window.crearTorneo = async () => {
    const nombreT = document.getElementById('nombreTorneo').value;
    if (!nombreT) return alert("Escribe un nombre para el torneo");
    const datos = JSON.parse(localStorage.getItem('torneo_data')) || { equipos: [] };

    try {
        await setDoc(doc(db, "torneos", nombreT), { config: datos });
        alert("¡Torneo guardado en Firebase!");
    } catch (e) {
        alert("Error al guardar: " + e.message);
    }
};

// Avisar al HTML cuando alguien entra o sale
onAuthStateChanged(auth, (user) => {
    if (window.cambiarModo) window.cambiarModo(user);
});
