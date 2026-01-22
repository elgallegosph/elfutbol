import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

// --- 1. CARGAR TORNEOS PARA TODO EL MUNDO (PÚBLICO) ---
async function cargarTorneosPublicos() {
    const q = query(collection(db, "torneos")); // Quitamos el filtro de userId para que todos vean todo
    const querySnapshot = await getDocs(q);
    const lista = document.getElementById('listaTorneosPublicos');
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.style = "padding: 12px; cursor: pointer; border: 1px solid #333; background: white; font-weight: bold; border-radius: 5px;";
        
        btn.onclick = () => {
            // Acción pública: Cambiar fondo
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
            // Aquí podrías añadir lógica para cargar la tabla de este torneo específico
        };
        lista.appendChild(btn);
    });
}

// Ejecutar carga pública al abrir la web
cargarTorneosPublicos();

// --- 2. FUNCIONES DE ADMINISTRADOR ---
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Administrador registrado correctamente");
    } catch (e) { alert("Error: " + e.message); }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('auth-container').style.display = 'none';
    } catch (e) { alert("Error: " + e.message); }
};

window.logout = () => signOut(auth);

window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    if(!nombre) return alert("El torneo necesita un nombre");

    try {
        await addDoc(collection(db, "torneos"), {
            nombre: nombre,
            fondoUrl: fondo,
            userId: auth.currentUser.uid,
            fecha: new Date()
        });
        alert("Torneo publicado");
        cargarTorneosPublicos(); // Actualiza la lista para todos
    } catch (e) { alert("Error al guardar: " + e.message); }
};

// --- 3. DETECTOR DE SESIÓN (Solo para mostrar el panel de admin) ---
onAuthStateChanged(auth, (user) => {
    const priv = document.getElementById('seccion-privada');
    const btnLogin = document.getElementById('btn-mostrar-login');

    if (user) {
        priv.style.display = 'block';
        if(btnLogin) btnLogin.style.display = 'none';
    } else {
        priv.style.display = 'none';
        if(btnLogin) btnLogin.style.display = 'block';
    }
});
