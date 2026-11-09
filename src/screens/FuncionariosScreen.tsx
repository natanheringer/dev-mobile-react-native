import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Network from 'expo-network';
import { estilos } from '../styles/estilosCompartilhados';
import type { Funcionario } from '../types/Funcionario';
import {
    observarFuncionarios,
    criarFuncionario,
    atualizarFuncionario,
    removerFuncionario,
} from '../services/funcionarioService';
import { salvarFuncionarioOffline, buscarPendentes, limparPendentes } from '../database/sqlite';
import BarraBusca from '../components/BarraBusca';
import BlocoSecao from '../components/BlocoSecao';
import CampoTexto from '../components/CampoTexto';
import AlertaMensagem from '../components/AlertaMensagem';
import BarraStatusRede from '../components/BarraStatusRede';
import CardFormulario from '../components/CardFormulario';
import BotoesFormulario from '../components/BotoesFormulario';
import ListaCadastro from '../components/ListaCadastro';
import AcoesItem from '../components/AcoesItem';

/** CRUD de funcionários, com fila offline no SQLite. */
export default function FuncionariosScreen() {
    const [lista, setLista] = useState<Funcionario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [sincronizando, setSincronizando] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [totalPendentes, setTotalPendentes] = useState(0);
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [busca, setBusca] = useState('');
    const [aviso, setAviso] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');

    /** Lê se há internet e quantos registros estão pendentes no SQLite. */
    const verificarStatusRede = useCallback(async () => {
        try {
            const rede = await Network.getNetworkStateAsync();
            const online = rede.isConnected !== false && rede.isInternetReachable !== false;
            setIsOnline(online);
        } catch {
            setIsOnline(true);
        }

        try {
            const pendentes = await buscarPendentes();
            setTotalPendentes(pendentes ? pendentes.length : 0);
        } catch {
            setTotalPendentes(0);
        }
    }, []);

    useEffect(() => {
        verificarStatusRede();

        return observarFuncionarios(
            (funcionarios: Funcionario[]) => {
                setLista(funcionarios);
                setCarregando(false);
            },
            (erro: Error) => {
                setAviso(erro.message);
                setCarregando(false);
            }
        );
    }, [verificarStatusRede]);

    /** Zera o formulário e fecha o cadastro. */
    function limparFormulario() {
        setEditandoId(null);
        setNome('');
        setEmail('');
        setCargo('');
        setFormularioAberto(false);
        setAviso(null);
        setSucesso(null);
    }

    /** Abre o formulário preenchido com o funcionário escolhido. */
    function iniciarEdicao(item: Funcionario) {
        setEditandoId(item.id ?? null);
        setNome(item.nome);
        setEmail(item.email);
        setCargo(item.cargo ?? '');
        setFormularioAberto(true);
        setAviso(null);
        setSucesso(null);
    }

    /** Grava na nuvem se houver rede; senão, salva no SQLite. */
    async function handleSalvar() {
        setAviso(null);
        setSucesso(null);

        if (!nome.trim() || !email.trim()) {
            setAviso('Nome completo e e-mail corporativo são obrigatórios.');
            return;
        }

        setSalvando(true);
        try {
            const statusRede = await Network.getNetworkStateAsync();
            const conectou = statusRede.isConnected !== false;

            if (conectou) {
                if (editandoId) {
                    await atualizarFuncionario(editandoId, { nome, email, cargo });
                    setSucesso('Registro atualizado no Firestore.');
                } else {
                    await criarFuncionario({ nome, email, cargo });
                    setSucesso('Registro gravado na nuvem (Firestore).');
                }
            } else {
                if (editandoId) {
                    setAviso('Edição offline não disponível no momento.');
                    return;
                }
                const idTemp = 'offline_' + Date.now();
                await salvarFuncionarioOffline(idTemp, nome, email, cargo);
                setSucesso('Sem conexão: armazenado localmente em SQLite.');
                verificarStatusRede();
            }

            limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setSalvando(false);
        }
    }

    /** Envia os pendentes do SQLite para o Firestore. */
    async function handleSincronizar() {
        setAviso(null);
        setSucesso(null);
        setSincronizando(true);

        try {
            const statusRede = await Network.getNetworkStateAsync();
            if (statusRede.isConnected === false) {
                setAviso('Conexão com a internet indisponível.');
                return;
            }

            const pendentes: any = await buscarPendentes();
            if (!pendentes || pendentes.length === 0) {
                setSucesso('A base local já está perfeitamente sincronizada.');
                return;
            }

            for (const item of pendentes) {
                await criarFuncionario({
                    nome: item.nome,
                    email: item.email,
                    cargo: item.cargo,
                });
            }

            await limparPendentes();
            setSucesso(`${pendentes.length} registro(s) sincronizado(s) com o Firestore.`);
            verificarStatusRede();
        } catch {
            setAviso('Falha no processo de sincronização com o servidor.');
        } finally {
            setSincronizando(false);
        }
    }

    /** Remove o funcionário pelo id. */
    async function handleExcluir(id?: string) {
        if (!id) return;
        setAviso(null);
        try {
            await removerFuncionario(id);
            if (editandoId === id) limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        }
    }

    const termo = busca.toLowerCase();
    const itensFiltrados = lista.filter(
        (item) =>
            item.nome.toLowerCase().includes(termo) ||
            item.email.toLowerCase().includes(termo) ||
            (item.cargo && item.cargo.toLowerCase().includes(termo))
    );

    return (
        <View style={estilos.tela}>
            <BarraStatusRede
                isOnline={isOnline}
                totalPendentes={totalPendentes}
                sincronizando={sincronizando}
                onSincronizar={handleSincronizar}
            />

            <BarraBusca
                busca={busca}
                onChangeBusca={setBusca}
                placeholder="Buscar funcionário por nome, cargo ou e-mail..."
                formularioAberto={formularioAberto}
                onToggleFormulario={() => {
                    limparFormulario();
                    if (!formularioAberto) setFormularioAberto(true);
                }}
            />

            {formularioAberto && (
                <CardFormulario
                    titulo={editandoId ? 'ATUALIZAÇÃO DE FUNCIONÁRIO' : 'CADASTRO DE NOVO MEMBRO'}
                    subtitulo="Registro corporativo com suporte a espelhamento offline."
                >
                    <AlertaMensagem tipo="erro" mensagem={aviso} />
                    <AlertaMensagem tipo="sucesso" mensagem={sucesso} />

                    <BlocoSecao titulo="1. DADOS CADASTRAIS DO COLABORADOR">
                        <CampoTexto
                            label="NOME COMPLETO *"
                            valor={nome}
                            onChange={setNome}
                            placeholder="Ex: Carlos Drummond de Andrade"
                        />
                        <CampoTexto
                            label="E-MAIL CORPORATIVO *"
                            valor={email}
                            onChange={setEmail}
                            placeholder="carlos@empresa.com.br"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <CampoTexto
                            label="CARGO / FUNÇÃO"
                            valor={cargo}
                            onChange={setCargo}
                            placeholder="Ex: Gerente de Operações, Analista, etc."
                            semDivisor
                        />
                    </BlocoSecao>

                    <View style={estilos.secaoBloco}>
                        <Text style={estilos.secaoRotulo}>2. ARMAZENAMENTO E DISPONIBILIDADE</Text>
                        <View style={estilos.blocoInformativo}>
                            <Text style={estilos.blocoInformativoTitulo}>DESTINO DO REGISTRO:</Text>
                            <Text style={estilos.blocoInformativoTexto}>
                                {isOnline
                                    ? '• Conexão ativa detectada: Gravação imediata no Firestore Cloud.'
                                    : '• Dispositivo sem rede: O registro será gravado na tabela SQLite local e entrará na fila de sincronização.'}
                            </Text>
                        </View>
                    </View>

                    <BotoesFormulario
                        salvando={salvando}
                        textoSalvar={editandoId ? 'SALVAR ALTERAÇÕES' : 'GRAVAR FUNCIONÁRIO'}
                        onSalvar={handleSalvar}
                        onCancelar={limparFormulario}
                    />
                </CardFormulario>
            )}

            {!formularioAberto && (
                <ListaCadastro
                    titulo="QUADRO DE FUNCIONÁRIOS"
                    totalTexto={`${itensFiltrados.length} MEMBROS REGISTRADOS`}
                    carregando={carregando}
                    textoCarregando="Carregando funcionários..."
                    vazioTitulo="Nenhum funcionário cadastrado"
                    vazioSub='Toque em "+ NOVO" acima para cadastrar um colaborador.'
                    dados={itensFiltrados}
                    chave={(item) => item.id ?? item.email}
                    renderItem={(item) => (
                        <View style={estilos.cardItem}>
                            <View style={estilos.itemTopo}>
                                <Text style={estilos.itemNome}>{item.nome}</Text>
                                <Text style={[estilos.itemTagMuda, item.pendente && estilos.textoAviso]}>
                                    {item.pendente ? 'LOCAL (SQLITE)' : 'FIRESTORE CLOUD'}
                                </Text>
                            </View>

                            <View style={estilos.itemCorpo}>
                                <Text style={estilos.itemDadoRotulo}>CARGO / FUNÇÃO:</Text>
                                <Text style={estilos.itemDadoValor}>
                                    {item.cargo ? item.cargo.toUpperCase() : 'NÃO DEFINIDO'}
                                </Text>
                                <View style={{ marginTop: 4 }}>
                                    <Text style={estilos.itemDadoRotulo}>E-MAIL CORPORATIVO:</Text>
                                    <Text style={[estilos.itemDadoValor, estilos.mono]}>{item.email}</Text>
                                </View>
                            </View>

                            <AcoesItem
                                onEditar={() => iniciarEdicao(item)}
                                onExcluir={() => handleExcluir(item.id)}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
}
