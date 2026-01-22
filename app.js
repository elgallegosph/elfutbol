import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase (Verifica que estos datos sean los de tu consola)
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------------------------------------------------
// 1. ESCUCHA EN TIEMPO REAL (Para Admin y Visitantes)
// ---------------------------------------------------------
// Esta función detecta cambios en la nube y los manda al index.html
onSnapshot(doc(db, "campeonatos", "torneo_actual"), (docSnap) => {
    if (docSnap.exists()) {
        const datosRecibidos = docSnap.data().data;
        if (window.actualizarDesdeNube) {
            window.actualizarDesdeNube(datosRecibidos);
        }
    } else {
        console.log("No hay datos en la nube aún.");
    }
}, (error) => {
    console.error("Error en tiempo real:", error);
});

// ---------------------------------------------------------
// 2. FUNCIONES DE AUTENTICACIÓN
// ---------------------------------------------------------

window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Cuenta de Administrador creada con éxito");
    } catch (e) {
        alert("Error al registrar: " + e.message);
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
        alert("Error de acceso: " + e.message);
    }
};

window.logout = () => {
    signOut(auth).then(() => {
        // Al cerrar sesión, forzamos recarga para limpiar estado
        location.reload();
    });
};

// Detectar si el usuario está logueado o no
onAuthStateChanged(auth, (user) => {
    if (window.cambiarModo) {
        window.cambiarModo(user);
    }
});

// ---------------------------------------------------------
// 3. FUNCIÓN PARA PUBLICAR (Solo Admin)
// ---------------------------------------------------------
window.publicarTorneo = async (datos) => {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No puedes guardar: Debes iniciar sesión como Admin.");
        return;
    }

    try {
        await setDoc(doc(db, "campeonatos", "torneo_actual"), { 
            data: datos,
            autor: user.email,
            ultimaActualizacion: new Date().toISOString()
        });
        console.log("Nube actualizada correctamente.");
    } catch (e) {
        console.error("Error al guardar en Firebase:", e);
        alert("No tienes permisos para guardar. Verifica las reglas de tu base de datos.");
    }
};
