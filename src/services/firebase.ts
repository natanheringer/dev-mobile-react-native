/***

    Inicializacao unica do Firebase.

    As credenciais vem das variaveis de ambiente EXPO_PUBLIC_*, lidas do
    arquivo .env na raiz do projeto (o .env nao vai para o git). Use o
    .env.example como modelo.

*/

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

};

// Avisa cedo quando o .env nao foi preenchido, em vez de falhar depois
// no meio de uma consulta ao Firestore.
if (!firebaseConfig.projectId) {
    console.warn(
        "[firebase] EXPO_PUBLIC_FIREBASE_PROJECT_ID nao definido. " +
        "Copie .env.example para .env e preencha as credenciais."
    );
}

// getApps() evita reinicializar o app no hot reload do Expo.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export default app;
