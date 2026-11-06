/***

    API de acesso aos funcionarios no Firestore (CRUD).

    Esta e a unica camada que conhece o Firestore: as telas chamam apenas
    as funcoes abaixo e recebem objetos Funcionario ja tipados. Toda funcao
    lanca Error com mensagem legivel quando a operacao falha, para a tela
    poder exibir o aviso ao usuario.

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

import { db } from "./firebase";
import type { Funcionario, NovoFuncionario, FuncionarioAlteracao } from "../types/Funcionario";

/*** Nome da colecao no Firestore. Em um lugar so, para nao divergir. */
export const COLECAO = "funcionarios";

const colecaoFuncionarios = collection(db, COLECAO);

/* ------------------------------------------------------------------ */
/* Apoio interno                                                       */
/* ------------------------------------------------------------------ */

/*** Converte um documento do Firestore no objeto Funcionario da aplicacao. */
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
        // hasPendingWrites: o registro ja esta na tela mas o servidor ainda
        // nao confirmou, e por isso criadoEm continua null por um instante.
        pendente:  snap.metadata.hasPendingWrites,
    };
}

/***
    Ordena do mais recente para o mais antigo.

    Quem acabou de ser cadastrado chega com criadoEm null (o serverTimestamp
    so e resolvido pelo servidor), e por isso nao pode ser ordenado pelo
    banco: iria para o fim da lista. Aqui ele conta como o mais novo, fica
    no topo na mesma hora e permanece no topo quando a data chega.
*/
function maisRecentesPrimeiro(a: Funcionario, b: Funcionario): number {
    const quando = (f: Funcionario) =>
        f.criadoEm ? f.criadoEm.toMillis() : Number.MAX_SAFE_INTEGER;
    return quando(b) - quando(a);
}

/*** Normaliza o texto digitado: sem espacos nas pontas, email em minusculas. */
function limpar(dados: FuncionarioAlteracao): FuncionarioAlteracao {
    const saida: FuncionarioAlteracao = {};
    if (dados.nome  !== undefined) saida.nome  = dados.nome.trim();
    if (dados.email !== undefined) saida.email = dados.email.trim().toLowerCase();
    if (dados.cargo !== undefined) saida.cargo = dados.cargo.trim();
    return saida;
}

/*** Validacao minima dos campos obrigatorios antes de ir ao banco. */
function validar(dados: FuncionarioAlteracao, exigirTodos: boolean): void {
    const erros: string[] = [];

    if (exigirTodos || dados.nome !== undefined) {
        if (!dados.nome) erros.push("o nome e obrigatorio");
        else if (dados.nome.length < 2) erros.push("o nome precisa de ao menos 2 letras");
    }

    if (exigirTodos || dados.email !== undefined) {
        if (!dados.email) erros.push("o email e obrigatorio");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push("o email e invalido");
    }

    if (erros.length) throw new Error("Dados invalidos: " + erros.join("; ") + ".");
}

/*** Repassa a falha do Firestore com uma mensagem util para a tela. */
function falha(acao: string, erro: unknown): never {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    throw new Error(`Nao foi possivel ${acao}: ${detalhe}`);
}

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

/*** Lista os funcionarios, dos mais recentes para os mais antigos. */
export async function listarFuncionarios(): Promise<Funcionario[]> {
    try {
        const resultado = await getDocs(colecaoFuncionarios);
        return resultado.docs.map(paraFuncionario).sort(maisRecentesPrimeiro);
    } catch (erro) {
        falha("carregar a lista de funcionarios", erro);
    }
}

/*** Busca um funcionario pelo id. Devolve null quando nao existe. */
export async function buscarFuncionario(id: string): Promise<Funcionario | null> {
    if (!id) throw new Error("Id do funcionario nao informado.");
    try {
        const snap = await getDoc(doc(db, COLECAO, id));
        return snap.exists() ? paraFuncionario(snap) : null;
    } catch (erro) {
        falha("buscar o funcionario", erro);
    }
}

/*** Busca pelo email exato. Usado para nao cadastrar o mesmo email duas vezes. */
export async function buscarFuncionarioPorEmail(email: string): Promise<Funcionario | null> {
    const alvo = email.trim().toLowerCase();
    if (!alvo) throw new Error("Email nao informado.");
    try {
        const consulta = query(colecaoFuncionarios, where("email", "==", alvo), limit(1));
        const resultado = await getDocs(consulta);
        return resultado.empty ? null : paraFuncionario(resultado.docs[0]);
    } catch (erro) {
        falha("buscar o funcionario pelo email", erro);
    }
}

/***
    Observa a colecao em tempo real: o retorno de chamada roda a cada
    mudanca no banco. Devolve a funcao que cancela a escuta - chame-a no
    retorno do useEffect para nao deixar o ouvinte vivo.
*/
export function observarFuncionarios(
    aoAtualizar: (funcionarios: Funcionario[]) => void,
    aoFalhar?: (erro: Error) => void
): Unsubscribe {
    return onSnapshot(
        colecaoFuncionarios,
        (resultado) =>
            aoAtualizar(resultado.docs.map(paraFuncionario).sort(maisRecentesPrimeiro)),
        (erro) => aoFalhar?.(new Error("A lista parou de atualizar: " + erro.message))
    );
}

/* ------------------------------------------------------------------ */
/* Escrita                                                             */
/* ------------------------------------------------------------------ */

/*** Cadastra um funcionario e devolve o registro criado, com o id gerado. */
export async function criarFuncionario(dados: NovoFuncionario): Promise<Funcionario> {
    const limpos = limpar(dados);
    validar(limpos, true);

    const jaExiste = await buscarFuncionarioPorEmail(limpos.email!);
    if (jaExiste) throw new Error(`Ja existe um funcionario com o email ${limpos.email}.`);

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
        falha("cadastrar o funcionario", erro);
    }
}

/*** Atualiza os campos enviados de um funcionario ja cadastrado. */
export async function atualizarFuncionario(
    id: string,
    dados: FuncionarioAlteracao
): Promise<void> {
    if (!id) throw new Error("Id do funcionario nao informado.");

    const limpos = limpar(dados);
    if (Object.keys(limpos).length === 0) throw new Error("Nenhum campo para atualizar.");
    validar(limpos, false);

    if (limpos.email) {
        const outro = await buscarFuncionarioPorEmail(limpos.email);
        if (outro && outro.id !== id) {
            throw new Error(`O email ${limpos.email} ja pertence a outro funcionario.`);
        }
    }

    try {
        await updateDoc(doc(db, COLECAO, id), { ...limpos, editadoEm: serverTimestamp() });
    } catch (erro) {
        falha("atualizar o funcionario", erro);
    }
}

/*** Remove um funcionario. */
export async function removerFuncionario(id: string): Promise<void> {
    if (!id) throw new Error("Id do funcionario nao informado.");
    try {
        await deleteDoc(doc(db, COLECAO, id));
    } catch (erro) {
        falha("remover o funcionario", erro);
    }
}
