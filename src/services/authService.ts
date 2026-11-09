/***
    Serviço de autenticação com Firebase Auth.
    Inclui tratamento amigável de erros e fallback para testes locais quando
    as credenciais do Firebase ainda não foram inseridas no .env.
*/

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
} from 'firebase/auth';
import { auth, hasFirebaseConfig } from './firebase';

export interface UsuarioApp {
    uid: string;
    email: string | null;
}

// Armazenamento em memória para demonstração caso o .env não esteja configurado
let usuarioLocalDemo: UsuarioApp | null = null;
const ouvintesDemo: Array<(u: UsuarioApp | null) => void> = [];

/** Avisa as telas quando o usuário demo muda. */
function notificarOuvintesDemo() {
    ouvintesDemo.forEach((fn) => fn(usuarioLocalDemo));
}

/** Converte código de erro do Firebase em texto para o usuário. */
export function traduzirErroAuth(erro: unknown): string {
    if (!erro || typeof erro !== 'object') return 'Ocorreu um erro inesperado.';
    const code = (erro as { code?: string }).code || '';

    switch (code) {
        case 'auth/invalid-email':
            return 'O endereço de e-mail informado é inválido.';
        case 'auth/user-disabled':
            return 'Este usuário foi desativado.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'E-mail ou senha incorretos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso por outra conta.';
        case 'auth/weak-password':
            return 'A senha deve conter pelo menos 6 caracteres.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
        case 'auth/network-request-failed':
            return 'Falha de conexão. Verifique sua internet.';
        default:
            return (erro as Error).message || 'Erro de autenticação.';
    }
}

/** Cria uma conta (Firebase ou modo demo). */
export async function cadastrarUsuario(email: string, senha: string): Promise<UsuarioApp> {
    const emailLimpo = email.trim();
    if (!emailLimpo) throw new Error('Informe o e-mail.');
    if (!senha || senha.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');

    if (!hasFirebaseConfig) {
        // Fallback para modo demo/desenvolvimento
        usuarioLocalDemo = { uid: 'demo_' + Date.now(), email: emailLimpo };
        notificarOuvintesDemo();
        return usuarioLocalDemo;
    }

    const cred = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
    return { uid: cred.user.uid, email: cred.user.email };
}

/** Entra com e-mail e senha. */
export async function loginUsuario(email: string, senha: string): Promise<UsuarioApp> {
    const emailLimpo = email.trim();
    if (!emailLimpo) throw new Error('Informe o e-mail.');
    if (!senha) throw new Error('Informe a senha.');

    if (!hasFirebaseConfig) {
        usuarioLocalDemo = { uid: 'demo_' + Date.now(), email: emailLimpo };
        notificarOuvintesDemo();
        return usuarioLocalDemo;
    }

    const cred = await signInWithEmailAndPassword(auth, emailLimpo, senha);
    return { uid: cred.user.uid, email: cred.user.email };
}

/** Encerra a sessão. */
export async function logoutUsuario(): Promise<void> {
    if (!hasFirebaseConfig) {
        usuarioLocalDemo = null;
        notificarOuvintesDemo();
        return;
    }
    await signOut(auth);
}

/** Observa se há usuário logado; devolve função para cancelar. */
export function observarAuth(aoMudar: (usuario: UsuarioApp | null) => void): () => void {
    if (!hasFirebaseConfig) {
        ouvintesDemo.push(aoMudar);
        aoMudar(usuarioLocalDemo);
        return () => {
            const idx = ouvintesDemo.indexOf(aoMudar);
            if (idx >= 0) ouvintesDemo.splice(idx, 1);
        };
    }

    return onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
            aoMudar({ uid: user.uid, email: user.email });
        } else {
            aoMudar(null);
        }
    });
}
