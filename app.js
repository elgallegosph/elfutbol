import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// !!! COPIA TUS DATOS REALES AQUÍ !!!
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI", 
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// REGISTRO
const register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada!");
    } catch (e) { alert("Error: " + e.message); }
};

// LOGIN
const login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Error: " + e.message); }
};

// PUBLICAR
const crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const datos = JSON.parse(localStorage.getItem('torneo_data')) || { equipos: [] };
    try {
        await setDoc(doc(db, "torneos", nombre), { config: datos });
        alert("Publicado en la nube");
    } catch (e) { alert("Error: " + e.message); }
};

// VINCULAR AL HTML (Esto soluciona el error 'is not defined')
window.register = register;
window.login = login;
window.logout = () => signOut(auth);
window.crearTorneo = crearTorneo;

onAuthStateChanged(auth, (user) => {
    window.cambiarModo(user);
});
