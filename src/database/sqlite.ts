import * as SQLite from 'expo-sqlite';

export interface FuncionarioPendente {
    id: string;
    nome: string;
    email: string;
    cargo: string;
}

const ouvintes = new Set<() => void>();
let bancoPronto: Promise<SQLite.SQLiteDatabase> | undefined;

/** Abre o banco uma vez e cria a tabela antes de usá-lo. */
export function conectarBanco() {
    if (!bancoPronto) {
        bancoPronto = abrirBanco().catch((erro) => {
            bancoPronto = undefined;
            throw erro;
        });
    }
    return bancoPronto;
}

/** Cria a tabela de funcionários na primeira abertura. */
async function abrirBanco() {
    const db = await SQLite.openDatabaseAsync('estoque.db');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            cargo TEXT,
            sincronizado INTEGER DEFAULT 0
        );
    `);
    return db;
}

export async function inicializarTabelas() {
    await conectarBanco();
}

/** Avisa as telas e a sincronização quando a fila local muda. */
export function observarPendentes(aoMudar: () => void) {
    ouvintes.add(aoMudar);
    return () => { ouvintes.delete(aoMudar); };
}

/** Guarda o cadastro localmente antes de tentar enviá-lo ao Firestore. */
export async function salvarFuncionarioOffline(id: string, nome: string, email: string, cargo: string) {
    const db = await conectarBanco();

    await db.runAsync(
        `INSERT INTO funcionarios (id, nome, email, cargo, sincronizado) VALUES (?, ?, ?, ?, 0)`,
        id, nome.trim(), email.trim().toLowerCase(), cargo.trim()
    );
    ouvintes.forEach((ouvinte) => ouvinte());
}

/** Lista registros ainda não enviados à nuvem. */
export async function buscarPendentes(): Promise<FuncionarioPendente[]> {
    const db = await conectarBanco();
    return db.getAllAsync<FuncionarioPendente>(
        "SELECT id, nome, email, COALESCE(cargo, '') AS cargo FROM funcionarios WHERE sincronizado = 0 ORDER BY rowid"
    );
}

/** Remove somente o registro que o Firestore já confirmou. */
export async function removerPendente(id: string) {
    const db = await conectarBanco();
    await db.runAsync('DELETE FROM funcionarios WHERE id = ?', id);
    ouvintes.forEach((ouvinte) => ouvinte());
}
