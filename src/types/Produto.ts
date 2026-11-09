export interface Produto {
    id?: string;
    nome: string;
    codigo: string;
    categoria?: string;
    quantidade: number;
    preco: number;
}

export type NovoProduto = Omit<Produto, 'id'>;
