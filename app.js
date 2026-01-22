import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración extraída de tu imagen de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Carga pública de torneos para todos
async function cargarTorneos() {
    const querySnapshot = await getDocs(collection(db, "torneos"));
    const lista = document.getElementById('listaTorneosPublicos');
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.onclick = () => document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
        lista.appendChild(btn);
    });
}
cargarTorneos();

// Funciones globales para los botones del HTML
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Admin registrado");
    } catch (e) { alert("Error: " + e.message); }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch (e) { alert("Error: " + e.message); }
};

window.logout = () => signOut(auth).then(() => location.reload());

window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    await addDoc(collection(db, "torneos"), { nombre, fondoUrl: fondo, userId: auth.currentUser.uid });
    alert("Torneo creado");
    cargarTorneos();
};

// Control de vistas según estado de sesión
onAuthStateChanged(auth, (user) => {
    document.getElementById('seccion-privada').style.display = user ? 'block' : 'none';
    document.getElementById('auth-container').style.display = user ? 'none' : 'block';
});
