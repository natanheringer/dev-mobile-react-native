import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Fornecedor, NovoFornecedor } from '../types/Fornecedor';

const fornecedores = collection(db, 'fornecedores');

export function observarFornecedores(aoAtualizar: (lista: Fornecedor[]) => void, aoFalhar: (erro: Error) => void) {
    return onSnapshot(fornecedores, (resultado) => {
        const lista = resultado.docs.map((item) => ({ id: item.id, ...item.data() } as Fornecedor));
        aoAtualizar(lista);
    }, (erro) => aoFalhar(erro));
}

export async function criarFornecedor(dados: NovoFornecedor) {
    if (!dados.nome.trim()) throw new Error('O nome do fornecedor é obrigatório.');
    await addDoc(fornecedores, { ...dados, nome: dados.nome.trim() });
}

export async function atualizarFornecedor(id: string, dados: NovoFornecedor) {
    if (!dados.nome.trim()) throw new Error('O nome do fornecedor é obrigatório.');
    await updateDoc(doc(db, 'fornecedores', id), dados);
}

export async function removerFornecedor(id: string) {
    await deleteDoc(doc(db, 'fornecedores', id));
}
