/***
    Serviço de integração com a API externa ViaCEP (https://viacep.com.br/).
    Utilizado no cadastro e edição de fornecedores para preenchimento
    automático do endereço a partir do CEP.
*/

export interface DadosEnderecoCep {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string;         // Estado
    erro?: boolean;
}

/** Busca o endereço no ViaCEP a partir do CEP. */
export async function buscarEnderecoPorCep(cepEntrada: string): Promise<DadosEnderecoCep> {
    const cepNumeros = cepEntrada.replace(/\D/g, '');

    if (cepNumeros.length !== 8) {
        throw new Error('O CEP deve conter exatamente 8 dígitos.');
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        if (!resposta.ok) {
            throw new Error('Não foi possível consultar o CEP no servidor ViaCEP.');
        }

        const dados: DadosEnderecoCep = await resposta.json();

        if (dados.erro) {
            throw new Error('CEP não encontrado na base dos Correios.');
        }

        return dados;
    } catch (erro) {
        if (erro instanceof Error) {
            throw erro;
        }
        throw new Error('Erro ao consultar o serviço de CEP.');
    }
}
