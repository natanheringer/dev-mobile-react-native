export interface Fornecedor {
    id?: string;
    nome: string;
    telefone: string;
    email: string;
}

export type NovoFornecedor = Omit<Fornecedor, 'id'>;
