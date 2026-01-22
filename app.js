import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ESCUCHA AUTOMÁTICA (Para que el visitante vea cambios sin refrescar)
onSnapshot(doc(db, "campeonatos", "torneo_actual"), (docSnap) => {
    if (docSnap.exists()) {
        window.actualizarDesdeNube(docSnap.data().data);
    }
});

window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Admin registrado!");
    } catch (e) { alert("Error: " + e.message); }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Error: " + e.message); }
};

window.logout = () => signOut(auth);

// Función para subir datos a la nube
window.publicarTorneo = async (data) => {
    try {
        await setDoc(doc(db, "campeonatos", "torneo_actual"), { 
            data: data,
            ultimaActualizacion: new Date().toISOString()
        });
    } catch (e) { console.error("Error al publicar:", e); }
};

onAuthStateChanged(auth, (user) => { 
    window.cambiarModo(user); 
});
