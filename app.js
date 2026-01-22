import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// --- CARGAR TORNEOS (Para todos los visitantes) ---
async function cargarTorneosPublicos() {
    const querySnapshot = await getDocs(collection(db, "torneos"));
    const lista = document.getElementById('listaTorneosPublicos');
    if (!lista) return;
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.style = "padding: 12px 20px; cursor: pointer; border: 1px solid #333; background: #fff; border-radius: 8px; font-weight: bold; transition: 0.3s;";
        
        btn.onclick = () => {
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
        };
        lista.appendChild(btn);
    });
}

// Se ejecuta siempre al cargar la web
cargarTorneosPublicos();

// --- FUNCIONES GLOBALES ---
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Administrador registrado correctamente!");
    } catch (e) { alert("Error: " + e.message); }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) { alert("Error: " + e.message); }
};

window.logout = () => signOut(auth).then(() => location.reload());

window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    if(!nombre) return alert("Escribe un nombre");

    try {
        await addDoc(collection(db, "torneos"), {
            nombre: nombre,
            fondoUrl: fondo,
            userId: auth.currentUser.uid
        });
        alert("Torneo publicado exitosamente");
        cargarTorneosPublicos(); // Actualiza la lista pública
    } catch (e) { alert("Error: " + e.message); }
};

// --- CONTROL DE VISTA SEGÚN LOGIN ---
onAuthStateChanged(auth, (user) => {
    const seccionPrivada = document.getElementById('seccion-privada');
    const seccionAuth = document.getElementById('auth-container');
    
    if (user) {
        seccionPrivada.style.display = 'block';
        seccionAuth.style.display = 'none';
    } else {
        seccionPrivada.style.display = 'none';
        seccionAuth.style.display = 'block';
    }
});
