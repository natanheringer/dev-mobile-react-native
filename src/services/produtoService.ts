import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';
import type { Produto, NovoProduto } from '../types/Produto';

const produtosRef = collection(db, 'produtos');

let produtosLocais: Produto[] = [
    {
        id: 'prod-1',
        nome: 'Monitor Dell 27" 4K',
        codigo: 'MON-4K-01',
        categoria: 'Eletrônicos',
        quantidade: 14,
        preco: 2199.90,
    },
    {
        id: 'prod-2',
        nome: 'Teclado Mecânico Keychron K2',
        codigo: 'TEC-MEC-02',
        categoria: 'Periféricos',
        quantidade: 5,
        preco: 589.00,
    },
    {
        id: 'prod-3',
        nome: 'Cadeira Ergonômica Mesh Pro',
        codigo: 'CAD-ERG-03',
        categoria: 'Mobiliário',
        quantidade: 2,
        preco: 1250.00,
    },
];

const ouvintes: Array<(lista: Produto[]) => void> = [];
/** Avisa as telas que a lista local mudou. */
function notificar() {
    ouvintes.forEach((fn) => fn([...produtosLocais]));
}

/** Escuta a lista de produtos em tempo real. */
export function observarProdutos(
    aoAtualizar: (lista: Produto[]) => void,
    aoFalhar: (erro: Error) => void
) {
    if (!hasFirebaseConfig) {
        ouvintes.push(aoAtualizar);
        aoAtualizar([...produtosLocais]);
        return () => {
            const idx = ouvintes.indexOf(aoAtualizar);
            if (idx >= 0) ouvintes.splice(idx, 1);
        };
    }

    return onSnapshot(
        produtosRef,
        (resultado) => {
            const lista = resultado.docs.map(
                (item) => ({ id: item.id, ...item.data() } as Produto)
            );
            aoAtualizar(lista);
        },
        (erro) => aoFalhar(erro)
    );
}

/** Cadastra um produto. */
export async function criarProduto(dados: NovoProduto) {
    if (!dados.nome.trim() || !dados.codigo.trim()) {
        throw new Error('Nome e código são obrigatórios.');
    }
    if (dados.quantidade < 0 || dados.preco < 0) {
        throw new Error('Quantidade e preço não podem ser negativos.');
    }

    if (!hasFirebaseConfig) {
        const novo: Produto = {
            id: 'prod-' + Date.now(),
            ...dados,
            nome: dados.nome.trim(),
            codigo: dados.codigo.trim(),
        };
        produtosLocais.unshift(novo);
        notificar();
        return;
    }

    await addDoc(produtosRef, {
        ...dados,
        nome: dados.nome.trim(),
        codigo: dados.codigo.trim(),
    });
}

/** Atualiza um produto existente. */
export async function atualizarProduto(id: string, dados: NovoProduto) {
    if (!dados.nome.trim() || !dados.codigo.trim()) {
        throw new Error('Nome e código são obrigatórios.');
    }
    if (dados.quantidade < 0 || dados.preco < 0) {
        throw new Error('Quantidade e preço não podem ser negativos.');
    }

    if (!hasFirebaseConfig) {
        produtosLocais = produtosLocais.map((p) =>
            p.id === id ? { ...p, ...dados, nome: dados.nome.trim(), codigo: dados.codigo.trim() } : p
        );
        notificar();
        return;
    }

    await updateDoc(doc(db, 'produtos', id), dados);
}

/** Apaga um produto. */
export async function removerProduto(id: string) {
    if (!hasFirebaseConfig) {
        produtosLocais = produtosLocais.filter((p) => p.id !== id);
        notificar();
        return;
    }

    await deleteDoc(doc(db, 'produtos', id));
}
