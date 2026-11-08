import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Produto, NovoProduto } from '../types/Produto';

const produtos = collection(db, 'produtos');

export function observarProdutos(aoAtualizar: (lista: Produto[]) => void, aoFalhar: (erro: Error) => void) {
    return onSnapshot(produtos, (resultado) => {
        const lista = resultado.docs.map((item) => ({ id: item.id, ...item.data() } as Produto));
        aoAtualizar(lista);
    }, (erro) => aoFalhar(erro));
}

export async function criarProduto(dados: NovoProduto) {
    if (!dados.nome.trim() || !dados.codigo.trim()) throw new Error('Nome e código são obrigatórios.');
    if (dados.quantidade < 0 || dados.preco < 0) throw new Error('Quantidade e preço não podem ser negativos.');
    await addDoc(produtos, { ...dados, nome: dados.nome.trim(), codigo: dados.codigo.trim() });
}

export async function atualizarProduto(id: string, dados: NovoProduto) {
    if (!dados.nome.trim() || !dados.codigo.trim()) throw new Error('Nome e código são obrigatórios.');
    if (dados.quantidade < 0 || dados.preco < 0) throw new Error('Quantidade e preço não podem ser negativos.');
    await updateDoc(doc(db, 'produtos', id), dados);
}

export async function removerProduto(id: string) {
    await deleteDoc(doc(db, 'produtos', id));
}
