// En app.js
window.crearTorneo = async () => { 
   // ... todo el código que te pasé antes ...
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Tu configuración (Copiada de tu imagen)
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

// Función para guardar torneo
window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    const user = auth.currentUser;

    if(!user) return alert("Debes iniciar sesión");

    try {
        await addDoc(collection(db, "torneos"), {
            nombre: nombre,
            fondoUrl: fondo,
            userId: user.uid
        });
        alert("¡Torneo '" + nombre + "' creado con éxito!");
        cargarTorneos();
    } catch (e) {
        console.error("Error: ", e);
    }
};

// Función para cargar los torneos del usuario
async function cargarTorneos() {
    const user = auth.currentUser;
    const q = query(collection(db, "torneos"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    const contenedor = document.getElementById('listaTorneos');
    contenedor.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.onclick = () => {
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
        };
        contenedor.appendChild(btn);
    });
}

// Detectar usuario logueado
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('seccion-privada').style.display = 'block';
        cargarTorneos();
    }
});
