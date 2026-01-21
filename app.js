// 1. IMPORTACIONES (Siempre deben ir al principio)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 2. CONFIGURACIÓN (Tus datos de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDea95aNqXhCuIOHPyrFwJKPX1sRAQBbEg",
  authDomain: "elfutbolapp.firebaseapp.com",
  projectId: "elfutbolapp",
  storageBucket: "elfutbolapp.firebasestorage.app",
  messagingSenderId: "68652520852",
  appId: "1:68652520852:web:c6f274a48c57de05e5eb81"
};

// 3. INICIALIZACIÓN
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 4. FUNCIONES GLOBALES (AQUÍ ESTÁ LA SOLUCIÓN AL ERROR)
// Usamos window.nombreDeLaFuncion para que el botón del HTML pueda encontrarla
window.register = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (!email || !pass) return alert("Completa todos los campos");
    
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("¡Cuenta creada exitosamente!");
    } catch (e) { 
        alert("Error al registrar: " + e.message); 
    }
};

window.login = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("¡Bienvenido!");
    } catch (e) { 
        alert("Error al entrar: " + e.message); 
    }
};

window.logout = () => {
    signOut(auth).then(() => {
        alert("Sesión cerrada");
        location.reload(); 
    });
};

window.crearTorneo = async () => {
    const nombre = document.getElementById('nombreTorneo').value;
    const fondo = document.getElementById('urlFondo').value;
    const user = auth.currentUser;

    if(!user) return alert("Debes iniciar sesión");
    if(!nombre) return alert("Escribe un nombre para el torneo");

    try {
        await addDoc(collection(db, "torneos"), {
            nombre: nombre,
            fondoUrl: fondo,
            userId: user.uid
        });
        alert("¡Torneo '" + nombre + "' creado!");
        cargarTorneos(); 
    } catch (e) {
        console.error("Error: ", e);
    }
};

// 5. LÓGICA DE CARGA
async function cargarTorneos() {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "torneos"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    const contenedor = document.getElementById('listaTorneos');
    contenedor.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const t = doc.data();
        const btn = document.createElement('button');
        btn.innerText = t.nombre;
        btn.style = "margin: 5px; padding: 10px; cursor: pointer; border: 1px solid #000; background: #fff;";
        
        btn.onclick = () => {
            document.body.style.backgroundImage = `url('${t.fondoUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
        };
        contenedor.appendChild(btn);
    });
}

// 6. DETECTOR DE SESIÓN
onAuthStateChanged(auth, (user) => {
    const seccionPrivada = document.getElementById('seccion-privada');
    const seccionAuth = document.getElementById('auth-container');

    if (user) {
        if(seccionPrivada) seccionPrivada.style.display = 'block';
        if(seccionAuth) seccionAuth.style.display = 'none';
        cargarTorneos();
    } else {
        if(seccionPrivada) seccionPrivada.style.display = 'none';
        if(seccionAuth) seccionAuth.style.display = 'block';
    }
});
