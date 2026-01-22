import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// !!! REEMPLAZA ESTO CON TUS CREDENCIALES !!!
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

// FUNCION DE REGISTRO (Nueva)
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    
    if(pass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada con éxito! Bienvenido administrador.");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') alert("Este correo ya tiene cuenta.");
        else alert("Error al registrar: " + error.message);
    }
};

// FUNCION DE LOGIN
window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
        alert("Error: " + e.message);
    }
};

// FUNCION DE CERRAR SESIÓN
window.logout = () => signOut(auth);

// PUBLICAR TORNEO
window.crearTorneo = async () => {
    const nombreT = document.getElementById('nombreTorneo').value;
    if(!nombreT) return alert("Escribe un nombre para el torneo");
    const datos = JSON.parse(localStorage.getItem('torneo_data')) || { equipos: [] };

    try {
        await setDoc(doc(db, "torneos", nombreT), {
            config: datos,
            propietario: auth.currentUser.email
        });
        alert("Torneo publicado correctamente.");
    } catch (e) {
        alert("Error al publicar: " + e.message);
    }
};

// VIGILANTE DE ESTADO
onAuthStateChanged(auth, (user) => {
    window.cambiarModo(user);
});
