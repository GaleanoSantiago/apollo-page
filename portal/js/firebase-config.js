// Configuración de Firebase - VERSIÓN COMPAT (Para usar con scripts CDN HTML)
const firebaseConfig = {
  apiKey: "AIzaSyBNKKm9gZ_jhP-JzUIvfn1Oe4HgYWWfobA",
  authDomain: "apollocontratos-f3d86.firebaseapp.com",
  projectId: "apollocontratos-f3d86",
  storageBucket: "apollocontratos-f3d86.firebasestorage.app",
  messagingSenderId: "898298995758",
  appId: "1:898298995758:web:1cb3bb4615db872aeb6bbf"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exportar instancias globales
const auth = firebase.auth(); 
const db = firebase.firestore(); 