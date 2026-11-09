const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { stripTypeScriptTypes } = require('node:module');
const { SourceTextModule, SyntheticModule } = require('node:vm');
const { DatabaseSync } = require('node:sqlite');

// Usa SQLite real em memória. Rede e Firestore são simulados para provocar falhas.
async function preparar(t) {
    const banco = new DatabaseSync(':memory:');
    t.after(() => banco.close());
    const rede = new Set();
    const app = new Set();
    const nuvem = new Map();
    let online = false;
    let alcancavel = true;
    let falharId;
    let perderConfirmacao = false;
    let duranteEnvio;
    let aberturas = 0;
    const firebase = { db: {}, hasFirebaseConfig: true };

    const modulos = {};
    function mock(nome, valores) {
        modulos[nome] = new SyntheticModule(Object.keys(valores), function () {
            for (const [chave, valor] of Object.entries(valores)) this.setExport(chave, valor);
        });
    }
    mock('expo-sqlite', {
        openDatabaseAsync: async () => {
            aberturas++;
            return {
                execAsync: async (sql) => banco.exec(sql),
                runAsync: async (sql, ...args) => banco.prepare(sql).run(...args),
                getAllAsync: async (sql) => banco.prepare(sql).all(),
            };
        },
    });
    mock('expo-network', {
        getNetworkStateAsync: async () => ({ isConnected: online, isInternetReachable: alcancavel }),
        addNetworkStateListener: (fn) => { rede.add(fn); return { remove: () => rede.delete(fn) }; },
    });
    mock('react-native', {
        AppState: { addEventListener: (_, fn) => { app.add(fn); return { remove: () => app.delete(fn) }; } },
    });
    mock('./firebase', firebase);
    mock('firebase/firestore', {
        doc: (_, colecao, id) => `${colecao}/${id}`,
        serverTimestamp: () => 'data-do-servidor',
        setDoc: async (id, dados) => {
            if (id === falharId) throw new Error('Falha simulada');
            nuvem.set(id, dados);
            if (duranteEnvio) {
                const fn = duranteEnvio;
                duranteEnvio = undefined;
                await fn();
            }
            if (perderConfirmacao) {
                perderConfirmacao = false;
                throw new Error('Resposta perdida depois da gravação');
            }
        },
    });

    const sqlite = new SourceTextModule(stripTypeScriptTypes(readFileSync(resolve(__dirname, '../src/database/sqlite.ts'), 'utf8')));
    await sqlite.link((nome) => modulos[nome]);
    await sqlite.evaluate();
    modulos['../database/sqlite'] = sqlite;
    const sync = new SourceTextModule(stripTypeScriptTypes(readFileSync(resolve(__dirname, '../src/services/sincronizacaoService.ts'), 'utf8')));
    await sync.link((nome) => modulos[nome]);
    await sync.evaluate();

    return {
        local: sqlite.namespace,
        sync: sync.namespace,
        banco, nuvem, rede, app,
        conectar: (valor, internet = true) => {
            online = valor;
            alcancavel = internet;
            rede.forEach((fn) => fn());
        },
        falhar: (id) => { falharId = id; },
        perderConfirmacao: () => { perderConfirmacao = true; },
        duranteEnvio: (fn) => { duranteEnvio = fn; },
        aberturas: () => aberturas,
    };
}

const aguardarEventos = async () => {
    for (let i = 0; i < 8; i++) await new Promise(setImmediate);
};

test('SQLite inicializa uma vez e mantém o cadastro sem internet', async (t) => {
    const { local, sync, nuvem, aberturas } = await preparar(t);
    await Promise.all([local.inicializarTabelas(), local.inicializarTabelas()]);
    await local.salvarFuncionarioOffline('local-1', ' Ana ', ' ANA@EXEMPLO.COM ', ' Gerente ');
    await sync.sincronizarPendentes();
    const pendentes = await local.buscarPendentes();
    assert.equal(aberturas(), 1);
    assert.equal(pendentes.length, 1);
    assert.equal(pendentes[0].nome, 'Ana');
    assert.equal(pendentes[0].email, 'ana@exemplo.com');
    assert.equal(nuvem.size, 0);
});

test('retorno da conexão envia automaticamente e remove os ouvintes ao encerrar', async (t) => {
    const e = await preparar(t);
    const parar = e.sync.iniciarSincronizacao();
    await e.local.salvarFuncionarioOffline('local-1', 'Ana', 'ana@exemplo.com', 'Gerente');
    await aguardarEventos();
    assert.equal(e.nuvem.size, 0);
    e.conectar(true);
    await aguardarEventos();
    assert.equal(e.nuvem.size, 1);
    assert.equal((await e.local.buscarPendentes()).length, 0);
    parar();
    assert.equal(e.rede.size, 0);
    assert.equal(e.app.size, 0);
});

test('falha parcial remove somente os confirmados e permite nova tentativa', async (t) => {
    const e = await preparar(t);
    e.conectar(true);
    await e.local.salvarFuncionarioOffline('a', 'Ana', 'ana@exemplo.com', '');
    await e.local.salvarFuncionarioOffline('b', 'Bia', 'bia@exemplo.com', '');
    e.falhar('funcionarios/b');
    await e.sync.sincronizarPendentes();
    assert.deepEqual((await e.local.buscarPendentes()).map((p) => p.id), ['b']);
    assert.match(e.sync.obterEstadoSincronizacao().erro, /continuam no SQLite/);
    e.falhar(undefined);
    await e.sync.sincronizarPendentes();
    assert.equal(e.nuvem.size, 2);
    assert.equal((await e.local.buscarPendentes()).length, 0);
    assert.equal(e.sync.obterEstadoSincronizacao().erro, null);
});

test('resposta perdida e tentativas simultâneas não duplicam o documento', async (t) => {
    const e = await preparar(t);
    e.conectar(true);
    await e.local.salvarFuncionarioOffline('a', 'Ana', 'ana@exemplo.com', '');
    e.perderConfirmacao();
    await e.sync.sincronizarPendentes();
    assert.equal((await e.local.buscarPendentes()).length, 1);
    const primeira = e.sync.sincronizarPendentes();
    const segunda = e.sync.sincronizarPendentes();
    assert.equal(primeira, segunda);
    await primeira;
    assert.equal(e.nuvem.size, 1);
    assert.equal((await e.local.buscarPendentes()).length, 0);
});

test('cadastro inserido durante o envio também é sincronizado', async (t) => {
    const e = await preparar(t);
    e.conectar(true);
    await e.local.salvarFuncionarioOffline('a', 'Ana', 'ana@exemplo.com', '');
    e.duranteEnvio(() => e.local.salvarFuncionarioOffline('b', 'Bia', 'bia@exemplo.com', ''));
    await e.sync.sincronizarPendentes();
    assert.equal(e.nuvem.size, 2);
    assert.equal((await e.local.buscarPendentes()).length, 0);
});

test('Wi-Fi sem acesso à internet preserva os dados locais', async (t) => {
    const e = await preparar(t);
    e.conectar(true, false);
    await e.local.salvarFuncionarioOffline('a', 'Ana', 'ana@exemplo.com', '');
    await e.sync.sincronizarPendentes();
    assert.equal(e.nuvem.size, 0);
    assert.equal((await e.local.buscarPendentes()).length, 1);
    assert.equal(e.sync.obterEstadoSincronizacao().online, false);
});
