// 1. IMPORTACIONES (Siempre arriba)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 2. TU CONFIGURACIÓN
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

// 3. FUNCIONES DE USUARIO (Globales para el HTML)
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (pass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");

    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada exitosamente!");
    } catch (e) {
        alert("Error de Firebase: " + e.message);
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("¡Sesión iniciada!");
    } catch (e) {
        alert("Error al entrar: " + e.message);
    }
};

window.logout = () => signOut(auth).then(() => location.reload());

// 4. GESTIÓN DE TORNEOS
window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    const user = auth.currentUser;

    if(!nombre) return alert("Escribe un nombre");

    try {
        await addDoc(collection(db, "torneos"), {
            nombre: nombre,
            fondoUrl: fondo,
            userId: user.uid
        });
        alert("Torneo guardado");
        cargarTorneos();
    } catch (e) { console.error(e); }
};

async function cargarTorneos() {
    const user = auth.currentUser;
    const q = query(collection(db, "torneos"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const lista = document.getElementById('listaTorneos');
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.style = "margin: 5px; padding: 10px; cursor: pointer;";
        btn.onclick = () => {
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
        };
        lista.appendChild(btn);
    });
}

// 5. DETECTOR DE SESIÓN
onAuthStateChanged(auth, (user) => {
    const priv = document.getElementById('seccion-privada');
    const pub = document.getElementById('auth-container');
    if (user) {
        priv.style.display = 'block';
        pub.style.display = 'none';
        cargarTorneos();
    } else {
        priv.style.display = 'none';
        pub.style.display = 'block';
    }
});
