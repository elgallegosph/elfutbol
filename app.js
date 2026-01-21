import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

// EXPORTAR A WINDOW PARA EL HTML
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (pass.length < 6) return alert("La contraseña debe tener al menos 6 letras o números.");

    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Registro exitoso!");
    } catch (e) {
        alert("Error: " + e.code + " - " + e.message);
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
        alert("Error al entrar: " + e.message);
    }
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
        alert("Torneo creado");
        cargarTorneos();
    } catch (e) { alert("Error al guardar: " + e.message); }
};

async function cargarTorneos() {
    const q = query(collection(db, "torneos"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const lista = document.getElementById('listaTorneos');
    lista.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.style = "margin: 5px; padding: 10px; cursor: pointer; border-radius: 5px;";
        btn.onclick = () => {
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
        };
        lista.appendChild(btn);
    });
}

onAuthStateChanged(auth, (user) => {
    document.getElementById('seccion-privada').style.display = user ? 'block' : 'none';
    document.getElementById('auth-container').style.display = user ? 'none' : 'block';
    if (user) cargarTorneos();
});
