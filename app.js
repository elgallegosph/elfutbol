import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Credenciales corregidas de tu proyecto 'elfutbolapp'
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar funciones al objeto global para que el HTML las vea
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada correctamente!");
    } catch (e) { alert("Error al registrar: " + e.message); }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Error al entrar: " + e.message); }
};

window.logout = () => signOut(auth);

window.publicarTorneo = async () => {
    const data = JSON.parse(localStorage.getItem('futbol_local'));
    try {
        await setDoc(doc(db, "campeonatos", "torneo_actual"), { data });
        alert("Sincronizado con Firebase exitosamente");
    } catch (e) { alert("Error al guardar: " + e.message); }
};

onAuthStateChanged(auth, (user) => {
    if (window.cambiarModo) window.cambiarModo(user);
});
