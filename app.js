const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg", // Verifica que no tenga espacios
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// REGISTRO
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta de administrador creada!");
    } catch (e) { alert("Error: " + e.message); }
};

// LOGIN
window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Error: " + e.message); }
};

// LOGOUT
window.logout = () => signOut(auth);

// PUBLICAR EN LA NUBE
window.publicarTorneo = async () => {
    const data = JSON.parse(localStorage.getItem('futbol_local'));
    try {
        // Referencia a tu colección 'campeonatos'
        await setDoc(doc(db, "campeonatos", "torneo_actual"), {
            data: data,
            ultimaActualizacion: new Date().toISOString()
        });
        alert("¡Tablas y Goleadores actualizados en la nube!");
    } catch (e) { 
        alert("Error al sincronizar: " + e.message); 
    }
};

// VIGILANTE
onAuthStateChanged(auth, (user) => {
    window.cambiarModo(user);
});
