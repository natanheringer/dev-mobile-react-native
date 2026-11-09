import * as SQLite from 'expo-sqlite';

// 1. Abre (ou cria) a conexão com o banco de dados do celular
export async function conectarBanco() {
    return await SQLite.openDatabaseAsync('estoque.db');
}

// 2. Cria a estrutura da tabela na primeira vez que o app abrir
export async function inicializarTabelas() {
    const db = await conectarBanco();

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

// 3. Função para o CRUD local: salvar sem internet
export async function salvarFuncionarioOffline(id: string, nome: string, email: string, cargo: string) {
    const db = await conectarBanco();

    await db.runAsync(
        `INSERT INTO funcionarios (id, nome, email, cargo, sincronizado) VALUES (?, ?, ?, ?, 0)`,
        id, nome, email, cargo
    );
}

// Busca quem foi salvo sem internet
export async function buscarPendentes() {
    const db = await conectarBanco();
    return await db.getAllAsync('SELECT * FROM funcionarios WHERE sincronizado = 0');
}

// Apaga os dados locais após enviar para a nuvem
export async function limparPendentes() {
    const db = await conectarBanco();
    await db.runAsync('DELETE FROM funcionarios WHERE sincronizado = 0');
}