import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. TU CONFIGURACIÓN DE FIREBASE (Cópiala de tu consola de Firebase)
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

// --- 2. VIGILANTE DE SESIÓN (ESTO ES LO MÁS IMPORTANTE) ---
// Detecta si eres tú (admin) o un visitante
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Si hay usuario, llamamos a la función del HTML para mostrar botones
    window.cambiarModo(true); 
    console.log("Admin conectado:", user.email);
  } else {
    // Si no hay usuario, ocultamos todo lo de edición
    window.cambiarModo(false);
    console.log("Modo visitante activo");
  }
});

// --- 3. FUNCIONES DE LOGIN Y REGISTRO ---

window.login = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("¡Bienvenido Administrador!");
  } catch (error) {
    alert("Error al entrar: " + error.message);
  }
};

window.register = async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Cuenta de administrador creada con éxito");
  } catch (error) {
    alert("Error al registrar: " + error.message);
  }
};

window.logout = async () => {
  try {
    await signOut(auth);
    alert("Sesión cerrada. Ahora eres visitante.");
  } catch (error) {
    console.error("Error al salir", error);
  }
};

// --- 4. FUNCIÓN PARA GUARDAR EL TORNEO EN LA NUBE ---
window.crearTorneo = async () => {
  const nombreT = document.getElementById('nombreTorneo').value;
  if(!nombreT) return alert("Ponle un nombre al torneo para guardarlo");
  
  // Obtenemos los datos que tienes en el LocalStorage (los que llenaste en el HTML)
  const datosLocales = JSON.parse(localStorage.getItem('torneo_data'));

  try {
    await setDoc(doc(db, "torneos", nombreT), {
      config: datosLocales,
      admin: auth.currentUser.email,
      fechaActualizacion: new Date()
    });
    alert("¡Torneo guardado en la base de datos de Firebase!");
  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
};
