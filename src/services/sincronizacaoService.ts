import * as Network from 'expo-network';
import { AppState } from 'react-native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';
import { buscarPendentes, observarPendentes, removerPendente } from '../database/sqlite';

const ouvintes = new Set<() => void>();
let estado = { online: false, sincronizando: false, erro: null as string | null };
let envioAtual: Promise<void> | null = null;

export function obterEstadoSincronizacao() { return estado; }

function atualizarEstado(dados: Partial<typeof estado>) {
    estado = { ...estado, ...dados };
    ouvintes.forEach((ouvinte) => ouvinte());
}

export function observarSincronizacao(aoMudar: () => void) {
    ouvintes.add(aoMudar);
    return () => { ouvintes.delete(aoMudar); };
}

export async function temInternet() {
    const rede = await Network.getNetworkStateAsync();
    return rede.isConnected === true && rede.isInternetReachable !== false;
}

/** Impede dois envios simultâneos pelo botão e pelo evento de rede. */
export function sincronizarPendentes(podeContinuar = () => true): Promise<void> {
    if (envioAtual) return envioAtual;
    envioAtual = enviarPendentes(podeContinuar).finally(() => { envioAtual = null; });
    return envioAtual;
}

async function enviarPendentes(podeContinuar: () => boolean) {
    try {
        const online = await temInternet();
        atualizarEstado({ online });
        if (!online || !podeContinuar()) return;

        let pendentes = await buscarPendentes();
        if (pendentes.length === 0) {
            atualizarEstado({ erro: null });
            return;
        }
        if (!hasFirebaseConfig) {
            throw new Error('Preencha o .env do Firebase para enviar os cadastros locais.');
        }
        atualizarEstado({ sincronizando: true, erro: null });

        while (pendentes.length > 0) {
            for (const item of pendentes) {
                if (!podeContinuar() || !(await temInternet())) return;

                // Repetir o envio usa o mesmo ID e não cria outro documento.
                await setDoc(doc(db, 'funcionarios', item.id), {
                    nome: item.nome,
                    email: item.email,
                    cargo: item.cargo,
                    criadoEm: serverTimestamp(),
                    editadoEm: serverTimestamp(),
                });
                await removerPendente(item.id);
            }
            // Inclui cadastros feitos enquanto o envio anterior estava em andamento.
            pendentes = await buscarPendentes();
        }
    } catch (erro) {
        atualizarEstado({
            erro: 'Não foi possível sincronizar. Os cadastros continuam no SQLite. ' +
                (erro instanceof Error ? erro.message : String(erro)),
        });
    } finally {
        atualizarEstado({ sincronizando: false });
    }
}

/** Sincroniza com o app aberto e usuário logado, em qualquer tela. */
export function iniciarSincronizacao() {
    let ativo = true;
    const tentar = () => { void sincronizarPendentes(() => ativo); };
    const atualizarRede = () => {
        void temInternet().then((online) => {
            if (!ativo) return;
            atualizarEstado({ online });
            if (online) tentar();
        }).catch(() => {
            if (ativo) atualizarEstado({ online: false });
        });
    };

    const rede = Network.addNetworkStateListener(atualizarRede);
    const app = AppState.addEventListener('change', (situacao) => {
        if (situacao === 'active') atualizarRede();
    });
    const cancelarPendentes = observarPendentes(tentar);
    atualizarRede();

    return () => {
        ativo = false;
        rede.remove();
        app.remove();
        cancelarPendentes();
    };
}
