/***
    API de acesso aos funcionários no Firestore (CRUD).

    Esta é a camada que conversa com o Firestore e fornece fallback
    local caso o .env com credenciais do Firebase ainda não tenha sido preenchido.
*/

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    limit,
    serverTimestamp,
    type DocumentData,
    type QueryDocumentSnapshot,
    type DocumentSnapshot,
    type Unsubscribe,
} from "firebase/firestore";

import { db, hasFirebaseConfig } from "./firebase";
import type { Funcionario, NovoFuncionario, FuncionarioAlteracao } from "../types/Funcionario";

export const COLECAO = "funcionarios";
const colecaoFuncionarios = collection(db, COLECAO);

// Dados locais de fallback
let funcionariosLocais: Funcionario[] = [
    {
        id: 'func-1',
        nome: 'Natan Heringer',
        email: 'natan@empresa.com.br',
        cargo: 'Gerente de Estoque',
        criadoEm: null,
    },
    {
        id: 'func-2',
        nome: 'Mariana Silva',
        email: 'mariana.silva@empresa.com.br',
        cargo: 'Operadora de Logística',
        criadoEm: null,
    },
];

const ouvintes: Array<(f: Funcionario[]) => void> = [];
/** Avisa as telas que a lista local mudou. */
function notificar() {
    ouvintes.forEach((fn) => fn([...funcionariosLocais]));
}

/** Converte um documento do Firestore para o tipo Funcionario. */
function paraFuncionario(
    snap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
): Funcionario {
    const dados = snap.data() ?? {};
    return {
        id:        snap.id,
        nome:      dados.nome ?? "",
        email:     dados.email ?? "",
        cargo:     dados.cargo ?? "",
        criadoEm:  dados.criadoEm ?? null,
        editadoEm: dados.editadoEm ?? null,
    };
}

/** Ordena do mais recente para o mais antigo. */
function maisRecentesPrimeiro(a: Funcionario, b: Funcionario): number {
    const tempoA = a.criadoEm?.toMillis() ?? (a.pendente ? Infinity : 0);
    const tempoB = b.criadoEm?.toMillis() ?? (b.pendente ? Infinity : 0);
    return tempoB - tempoA;
}

/** Tira espaços e normaliza e-mail. */
function limpar(dados: NovoFuncionario | FuncionarioAlteracao): FuncionarioAlteracao {
    const saida: FuncionarioAlteracao = {};
    if (dados.nome !== undefined) saida.nome = dados.nome.trim();
    if (dados.email !== undefined) saida.email = dados.email.trim().toLowerCase();
    if (dados.cargo !== undefined) saida.cargo = dados.cargo.trim();
    return saida;
}

/** Checa nome e e-mail; lança erro se estiver inválido. */
function validar(dados: FuncionarioAlteracao, exigirTodos: boolean): void {
    const erros: string[] = [];

    if (exigirTodos || dados.nome !== undefined) {
        if (!dados.nome) erros.push("o nome é obrigatório");
        else if (dados.nome.length < 2) erros.push("o nome precisa de ao menos 2 letras");
    }

    if (exigirTodos || dados.email !== undefined) {
        if (!dados.email) erros.push("o email é obrigatório");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push("o email é inválido");
    }

    if (erros.length) throw new Error("Dados inválidos: " + erros.join("; ") + ".");
}

/** Empacota o erro do Firestore numa mensagem clara. */
function falha(acao: string, erro: unknown): never {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    throw new Error(`Não foi possível ${acao}: ${detalhe}`);
}

/** Lista todos os funcionários. */
export async function listarFuncionarios(): Promise<Funcionario[]> {
    if (!hasFirebaseConfig) return [...funcionariosLocais];
    try {
        const resultado = await getDocs(colecaoFuncionarios);
        return resultado.docs.map(paraFuncionario).sort(maisRecentesPrimeiro);
    } catch (erro) {
        falha("carregar a lista de funcionários", erro);
    }
}

/** Busca um funcionário pelo id. */
export async function buscarFuncionario(id: string): Promise<Funcionario | null> {
    if (!id) throw new Error("Id do funcionário não informado.");
    if (!hasFirebaseConfig) {
        return funcionariosLocais.find((f) => f.id === id) ?? null;
    }
    try {
        const snap = await getDoc(doc(db, COLECAO, id));
        return snap.exists() ? paraFuncionario(snap) : null;
    } catch (erro) {
        falha("buscar o funcionário", erro);
    }
}

/** Busca um funcionário pelo e-mail. */
export async function buscarFuncionarioPorEmail(email: string): Promise<Funcionario | null> {
    const alvo = email.trim().toLowerCase();
    if (!alvo) throw new Error("Email não informado.");
    if (!hasFirebaseConfig) {
        return funcionariosLocais.find((f) => f.email.toLowerCase() === alvo) ?? null;
    }
    try {
        const consulta = query(colecaoFuncionarios, where("email", "==", alvo), limit(1));
        const resultado = await getDocs(consulta);
        return resultado.empty ? null : paraFuncionario(resultado.docs[0]);
    } catch (erro) {
        falha("buscar o funcionário pelo email", erro);
    }
}

/** Escuta a lista de funcionários em tempo real. */
export function observarFuncionarios(
    aoAtualizar: (funcionarios: Funcionario[]) => void,
    aoFalhar?: (erro: Error) => void
): Unsubscribe {
    if (!hasFirebaseConfig) {
        ouvintes.push(aoAtualizar);
        aoAtualizar([...funcionariosLocais]);
        return () => {
            const idx = ouvintes.indexOf(aoAtualizar);
            if (idx >= 0) ouvintes.splice(idx, 1);
        };
    }

    return onSnapshot(
        colecaoFuncionarios,
        (resultado) =>
            aoAtualizar(resultado.docs.map(paraFuncionario).sort(maisRecentesPrimeiro)),
        (erro) => aoFalhar?.(new Error("A lista parou de atualizar: " + erro.message))
    );
}

/** Cadastra um funcionário. */
export async function criarFuncionario(dados: NovoFuncionario): Promise<Funcionario> {
    const limpos = limpar(dados);
    validar(limpos, true);

    const jaExiste = await buscarFuncionarioPorEmail(limpos.email!);
    if (jaExiste) throw new Error(`Já existe um funcionário com o email ${limpos.email}.`);

    if (!hasFirebaseConfig) {
        const novo: Funcionario = {
            id: 'func-' + Date.now(),
            nome: limpos.nome!,
            email: limpos.email!,
            cargo: limpos.cargo ?? "",
            criadoEm: null,
            pendente: false,
        };
        funcionariosLocais.unshift(novo);
        notificar();
        return novo;
    }

    try {
        const criado = await addDoc(colecaoFuncionarios, {
            nome:      limpos.nome,
            email:     limpos.email,
            cargo:     limpos.cargo ?? "",
            criadoEm:  serverTimestamp(),
            editadoEm: serverTimestamp(),
        });
        return {
            id:       criado.id,
            nome:     limpos.nome!,
            email:    limpos.email!,
            cargo:    limpos.cargo ?? "",
            criadoEm: null,
            pendente: true,
        };
    } catch (erro) {
        falha("cadastrar o funcionário", erro);
    }
}

/** Atualiza um funcionário existente. */
export async function atualizarFuncionario(
    id: string,
    dados: FuncionarioAlteracao
): Promise<void> {
    if (!id) throw new Error("Id do funcionário não informado.");

    const limpos = limpar(dados);
    if (Object.keys(limpos).length === 0) throw new Error("Nenhum campo para atualizar.");
    validar(limpos, false);

    if (limpos.email) {
        const outro = await buscarFuncionarioPorEmail(limpos.email);
        if (outro && outro.id !== id) {
            throw new Error(`O email ${limpos.email} já pertence a outro funcionário.`);
        }
    }

    if (!hasFirebaseConfig) {
        funcionariosLocais = funcionariosLocais.map((f) =>
            f.id === id ? { ...f, ...limpos, nome: limpos.nome ?? f.nome, email: limpos.email ?? f.email } : f
        );
        notificar();
        return;
    }

    try {
        await updateDoc(doc(db, COLECAO, id), { ...limpos, editadoEm: serverTimestamp() });
    } catch (erro) {
        falha("atualizar o funcionário", erro);
    }
}

/** Apaga um funcionário. */
export async function removerFuncionario(id: string): Promise<void> {
    if (!id) throw new Error("Id do funcionário não informado.");

    if (!hasFirebaseConfig) {
        funcionariosLocais = funcionariosLocais.filter((f) => f.id !== id);
        notificar();
        return;
    }

    try {
        await deleteDoc(doc(db, COLECAO, id));
    } catch (erro) {
        falha("remover o funcionário", erro);
    }
}
