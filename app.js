import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. CONFIGURACIÓN (Asegúrate de que estos datos coincidan con tu consola Firebase)
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

// --- 2. CARGA AUTOMÁTICA PARA VISITANTES ---
async function cargarTorneosPublicos() {
    const listaContenedor = document.getElementById('listaTorneosPublicos');
    if (!listaContenedor) return;

    try {
        const querySnapshot = await getDocs(collection(db, "torneos"));
        listaContenedor.innerHTML = ""; // Limpiar carga

        querySnapshot.forEach((docSnap) => {
            const btn = document.createElement('button');
            btn.className = "btn-ver-torneo";
            btn.style.width = "auto";
            btn.style.margin = "5px";
            btn.innerText = `Ver: ${docSnap.id}`;
            btn.onclick = () => cargarDatosTorneo(docSnap.id);
            listaContenedor.appendChild(btn);
        });
    } catch (e) {
        console.error("Error cargando torneos:", e);
    }
}

async function cargarDatosTorneo(idTorneo) {
    const docRef = doc(db, "torneos", idTorneo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const datos = docSnap.data().config;
        // Guardamos en el almacenamiento local del navegador del visitante para que el HTML lo use
        localStorage.setItem('torneo_data', JSON.stringify(datos));
        // Forzamos al HTML a redibujar las tablas (Función que está en tu <script> del HTML)
        if (window.actualizarTodo) {
            window.actualizarTodo(); 
        } else {
            location.reload(); // Si no encuentra la función, recarga para aplicar
        }
        alert("Cargando datos de: " + idTorneo);
    }
}

// --- 3. VIGILANTE DE SESIÓN ---
onAuthStateChanged(auth, (user) => {
  const esAdmin = !!user;
  window.cambiarModo(esAdmin); 
  cargarTorneosPublicos(); // Cargamos la lista de torneos para todos
});

// --- 4. FUNCIONES DE ACCESO ---
window.login = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (error) {
    alert("Error: " + error.message);
  }
};

window.register = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Admin creado");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

window.logout = () => signOut(auth);

// --- 5. GUARDAR CAMBIOS (SOLO ADMIN) ---
window.crearTorneo = async () => {
  const nombreT = document.getElementById('nombreTorneo').value;
  if(!nombreT) return alert("Escribe el nombre del torneo para guardar");
  
  const datosLocales = JSON.parse(localStorage.getItem('torneo_data'));

  try {
    await setDoc(doc(db, "torneos", nombreT), {
      config: datosLocales,
      admin: auth.currentUser.email,
      ultimaVez: new Date()
    });
    alert("¡Torneo guardado en la nube! Los visitantes ya pueden verlo.");
    cargarTorneosPublicos(); 
  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
};
