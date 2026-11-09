import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';
import type { Fornecedor, NovoFornecedor } from '../types/Fornecedor';

const fornecedoresRef = collection(db, 'fornecedores');

// Fallback em memória para teste local/offline caso o Firebase não tenha .env preenchido
let fornecedoresLocais: Fornecedor[] = [
    {
        id: 'forn-1',
        nome: 'Distribuidora Minas Tech',
        telefone: '(31) 98765-4321',
        email: 'contato@minastech.com.br',
        cep: '30130-100',
        logradouro: 'Avenida Afonso Pena',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        uf: 'MG',
    },
    {
        id: 'forn-2',
        nome: 'Logística Brasil Express',
        telefone: '(11) 97123-8899',
        email: 'suporte@brasilexpress.com',
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        cidade: 'São Paulo',
        uf: 'SP',
    },
];

const ouvintes: Array<(lista: Fornecedor[]) => void> = [];
/** Avisa as telas que a lista local mudou. */
function notificar() {
    ouvintes.forEach((fn) => fn([...fornecedoresLocais]));
}

/** Escuta a lista de fornecedores em tempo real. */
export function observarFornecedores(
    aoAtualizar: (lista: Fornecedor[]) => void,
    aoFalhar: (erro: Error) => void
) {
    if (!hasFirebaseConfig) {
        ouvintes.push(aoAtualizar);
        aoAtualizar([...fornecedoresLocais]);
        return () => {
            const idx = ouvintes.indexOf(aoAtualizar);
            if (idx >= 0) ouvintes.splice(idx, 1);
        };
    }

    return onSnapshot(
        fornecedoresRef,
        (resultado) => {
            const lista = resultado.docs.map(
                (item) => ({ id: item.id, ...item.data() } as Fornecedor)
            );
            aoAtualizar(lista);
        },
        (erro) => aoFalhar(erro)
    );
}

/** Cadastra um fornecedor. */
export async function criarFornecedor(dados: NovoFornecedor) {
    if (!dados.nome.trim()) throw new Error('O nome do fornecedor é obrigatório.');

    if (!hasFirebaseConfig) {
        const novo: Fornecedor = {
            id: 'forn-' + Date.now(),
            ...dados,
            nome: dados.nome.trim(),
        };
        fornecedoresLocais.unshift(novo);
        notificar();
        return;
    }

    await addDoc(fornecedoresRef, { ...dados, nome: dados.nome.trim() });
}

/** Atualiza um fornecedor existente. */
export async function atualizarFornecedor(id: string, dados: NovoFornecedor) {
    if (!dados.nome.trim()) throw new Error('O nome do fornecedor é obrigatório.');

    if (!hasFirebaseConfig) {
        fornecedoresLocais = fornecedoresLocais.map((f) =>
            f.id === id ? { ...f, ...dados, nome: dados.nome.trim() } : f
        );
        notificar();
        return;
    }

    await updateDoc(doc(db, 'fornecedores', id), dados);
}

/** Apaga um fornecedor. */
export async function removerFornecedor(id: string) {
    if (!hasFirebaseConfig) {
        fornecedoresLocais = fornecedoresLocais.filter((f) => f.id !== id);
        notificar();
        return;
    }

    await deleteDoc(doc(db, 'fornecedores', id));
}
