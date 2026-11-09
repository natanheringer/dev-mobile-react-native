import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';
import type { Funcionario } from '../types/Funcionario';
import {
    observarFuncionarios,
    atualizarFuncionario,
    removerFuncionario,
} from '../services/funcionarioService';
import { salvarFuncionarioOffline, buscarPendentes, observarPendentes, type FuncionarioPendente } from '../database/sqlite';
import { obterEstadoSincronizacao, observarSincronizacao, sincronizarPendentes, temInternet } from '../services/sincronizacaoService';
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
    const [estadoSync, setEstadoSync] = useState(obterEstadoSincronizacao);
    const [pendentes, setPendentes] = useState<FuncionarioPendente[]>([]);
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [busca, setBusca] = useState('');
    const [aviso, setAviso] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');

    const carregarPendentes = useCallback(async () => {
        try {
            setPendentes(await buscarPendentes());
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void carregarPendentes();
        const cancelarLocal = observarPendentes(() => { void carregarPendentes(); });
        const cancelarSync = observarSincronizacao(() => setEstadoSync(obterEstadoSincronizacao()));
        setEstadoSync(obterEstadoSincronizacao());

        const cancelarNuvem = observarFuncionarios(
            (funcionarios: Funcionario[]) => {
                setLista(funcionarios);
                setCarregando(false);
            },
            (erro: Error) => {
                setAviso(erro.message);
                setCarregando(false);
            }
        );
        return () => {
            cancelarLocal();
            cancelarSync();
            cancelarNuvem();
        };
    }, [carregarPendentes]);

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

    /** Novos cadastros passam pelo SQLite antes do envio à nuvem. */
    async function handleSalvar() {
        setAviso(null);
        setSucesso(null);

        if (!nome.trim() || !email.trim()) {
            setAviso('Nome completo e e-mail corporativo são obrigatórios.');
            return;
        }
        if (nome.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setAviso('Informe um nome com pelo menos 2 letras e um e-mail válido.');
            return;
        }
        if (salvando) return;

        setSalvando(true);
        try {
            if (editandoId) {
                if (!(await temInternet())) {
                    setAviso('Edição offline não disponível no momento.');
                    return;
                }
                await atualizarFuncionario(editandoId, { nome, email, cargo });
                limparFormulario();
                setSucesso('Registro atualizado no Firestore.');
            } else {
                const emailLimpo = email.trim().toLowerCase();
                if ([...lista, ...pendentes].some((item) => item.email.toLowerCase() === emailLimpo)) {
                    setAviso('Já existe um funcionário com esse e-mail na lista.');
                    return;
                }
                const idTemp = 'offline_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
                await salvarFuncionarioOffline(idTemp, nome, email, cargo);
                await carregarPendentes();
                limparFormulario();
                setSucesso('Cadastro salvo no SQLite. O envio ao Firestore é automático quando há internet.');
            }
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setSalvando(false);
        }
    }

    /** Remove o funcionário pelo id. */
    async function handleExcluir(id?: string) {
        if (!id) return;
        setAviso(null);
        try {
            if (!(await temInternet())) {
                setAviso('Conecte-se à internet para excluir um funcionário da nuvem.');
                return;
            }
            await removerFuncionario(id);
            if (editandoId === id) limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        }
    }

    const termo = busca.toLowerCase();
    const listaCompleta: Funcionario[] = [
        ...pendentes.map((item) => ({ ...item, pendente: true })),
        ...lista.filter((item) => !pendentes.some((local) => local.id === item.id)),
    ];
    const itensFiltrados = listaCompleta.filter(
        (item) =>
            item.nome.toLowerCase().includes(termo) ||
            item.email.toLowerCase().includes(termo) ||
            (item.cargo && item.cargo.toLowerCase().includes(termo))
    );

    return (
        <View style={estilos.tela}>
            <BarraStatusRede
                isOnline={estadoSync.online}
                totalPendentes={pendentes.length}
                sincronizando={estadoSync.sincronizando}
                onSincronizar={() => { void sincronizarPendentes(); }}
            />

            <AlertaMensagem tipo="erro" mensagem={aviso || estadoSync.erro} />
            <AlertaMensagem tipo="sucesso" mensagem={sucesso} />

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
                                Novos cadastros ficam no SQLite até o Firestore confirmar o recebimento.
                                Sem internet, aguardam na lista. Ao reconectar, o envio é automático.
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

                            {item.pendente ? (
                                <Text style={estilos.itemDadoValor}>Aguardando envio automático para liberar edição e exclusão.</Text>
                            ) : <AcoesItem
                                onEditar={() => iniciarEdicao(item)}
                                onExcluir={() => handleExcluir(item.id)}
                            />}
                        </View>
                    )}
                />
            )}
        </View>
    );
}
