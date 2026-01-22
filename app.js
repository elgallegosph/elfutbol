import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REEMPLAZA ESTO CON TUS CREDENCIALES REALES DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Funciones globales para que el HTML las reconozca
window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("¡Bienvenido!");
    } catch (e) { alert("Error al entrar: " + e.message); }
};

window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Usuario creado correctamente");
    } catch (e) { alert("Error al registrar: " + e.message); }
};

window.logout = () => signOut(auth);

window.crearTorneo = async () => {
    const nombreT = document.getElementById('nombreTorneo').value;
    if(!nombreT) return alert("Escribe un nombre para guardar el torneo");
    const datosLocales = JSON.parse(localStorage.getItem('torneo_data'));
    try {
        await setDoc(doc(db, "torneos", nombreT), { config: datosLocales });
        alert("Torneo guardado en la nube exitosamente");
    } catch (e) { alert("Error al guardar: " + e.message); }
};

// Vigilante de sesión: Activa o desactiva el modo administrador
onAuthStateChanged(auth, (user) => {
    if (window.cambiarModo) {
        window.cambiarModo(!!user);
    }
});
