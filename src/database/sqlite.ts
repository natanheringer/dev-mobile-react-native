import * as SQLite from 'expo-sqlite';

/** Abre (ou cria) o banco SQLite local. */
export async function conectarBanco() {
    try {
        return await SQLite.openDatabaseAsync('estoque.db');
    } catch (erro) {
        console.warn('SQLite não pôde ser aberto:', erro);
        return null;
    }
}

/** Cria a tabela de funcionários na primeira abertura. */
export async function inicializarTabelas() {
    const db = await conectarBanco();
    if (!db) return;

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            cargo TEXT,
            sincronizado INTEGER DEFAULT 0
        );
    `);
}

/** Guarda um funcionário localmente quando não há internet. */
export async function salvarFuncionarioOffline(id: string, nome: string, email: string, cargo: string) {
    const db = await conectarBanco();
    if (!db) throw new Error('Armazenamento SQLite indisponível neste ambiente.');

    await db.runAsync(
        `INSERT INTO funcionarios (id, nome, email, cargo, sincronizado) VALUES (?, ?, ?, ?, 0)`,
        id, nome, email, cargo
    );
}

/** Lista registros ainda não enviados à nuvem. */
export async function buscarPendentes() {
    const db = await conectarBanco();
    if (!db) return [];
    return await db.getAllAsync('SELECT * FROM funcionarios WHERE sincronizado = 0');
}

/** Apaga os pendentes depois de sincronizar. */
export async function limparPendentes() {
    const db = await conectarBanco();
    if (!db) return;
    await db.runAsync('DELETE FROM funcionarios WHERE sincronizado = 0');
}
