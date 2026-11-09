export interface Fornecedor {
    id?: string;
    nome: string;
    telefone: string;
    email: string;
    cep?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
}

export type NovoFornecedor = Omit<Fornecedor, 'id'>;
