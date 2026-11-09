/***
    Inicialização única do Firebase.

    As credenciais vêm das variáveis de ambiente EXPO_PUBLIC_*, lidas do
    arquivo .env na raiz do projeto (o .env não vai para o git). Use o
    .env.example como modelo.
*/

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

export const hasFirebaseConfig = Boolean(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY
);

const firebaseConfig = {
    apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoFallbackKeyForTesting12345",
    authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "dev-mobile-estoque.firebaseapp.com",
    projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "dev-mobile-estoque",
    storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "dev-mobile-estoque.appspot.com",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

if (!hasFirebaseConfig) {
    console.warn(
        "[firebase] EXPO_PUBLIC_FIREBASE_PROJECT_ID não definido no .env. " +
        "Operando com fallback local/demonstração. Copie .env.example para .env para apontar para seu console Firebase."
    );
}

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);

let authInst: Auth;
try {
    authInst = getAuth(app);
} catch (erro) {
    authInst = {} as Auth;
}
export const auth: Auth = authInst;

export default app;
