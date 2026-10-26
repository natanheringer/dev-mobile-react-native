import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey:             "chave-api",
    authDomain:         "dominio-autenticacao",
    projetId:           "id-do-projeto",
    storageBucket:      "bucket-armazenamento",
    messagingSenderId:  "messaging_sender_id",
    appId:              "app-id"

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);