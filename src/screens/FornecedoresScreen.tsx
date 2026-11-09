import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';
import type { Fornecedor } from '../types/Fornecedor';
import {
    observarFornecedores,
    criarFornecedor,
    atualizarFornecedor,
    removerFornecedor,
} from '../services/fornecedorService';
import { buscarEnderecoPorCep } from '../services/cepService';
import BarraBusca from '../components/BarraBusca';
import BlocoSecao from '../components/BlocoSecao';
import CampoTexto from '../components/CampoTexto';
import AlertaMensagem from '../components/AlertaMensagem';
import CardFormulario from '../components/CardFormulario';
import BotoesFormulario from '../components/BotoesFormulario';
import ListaCadastro from '../components/ListaCadastro';
import AcoesItem from '../components/AcoesItem';
import CampoCep from '../components/CampoCep';

/** CRUD de fornecedores, com preenchimento de endereço via CEP. */
export default function FornecedoresScreen() {
    const [lista, setLista] = useState<Fornecedor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [busca, setBusca] = useState('');
    const [aviso, setAviso] = useState<string | null>(null);
    const [sucessoCep, setSucessoCep] = useState<string | null>(null);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');

    useEffect(() => {
        return observarFornecedores(
            (itens) => {
                setLista(itens);
                setCarregando(false);
            },
            (erro) => {
                setAviso(erro.message);
                setCarregando(false);
            }
        );
    }, []);

    /** Zera o formulário e fecha o cadastro. */
    function limparFormulario() {
        setEditandoId(null);
        setNome('');
        setTelefone('');
        setEmail('');
        setCep('');
        setLogradouro('');
        setBairro('');
        setCidade('');
        setUf('');
        setFormularioAberto(false);
        setAviso(null);
        setSucessoCep(null);
    }

    /** Abre o formulário preenchido com o fornecedor escolhido. */
    function iniciarEdicao(item: Fornecedor) {
        setEditandoId(item.id ?? null);
        setNome(item.nome);
        setTelefone(item.telefone);
        setEmail(item.email);
        setCep(item.cep ?? '');
        setLogradouro(item.logradouro ?? '');
        setBairro(item.bairro ?? '');
        setCidade(item.cidade ?? '');
        setUf(item.uf ?? '');
        setFormularioAberto(true);
        setAviso(null);
        setSucessoCep(null);
    }

    /** Consulta o ViaCEP e preenche rua, bairro, cidade e UF. */
    async function handleConsultarCep(cepManual?: string) {
        const cepParaBusca = (cepManual || cep).replace(/\D/g, '');

        if (cepParaBusca.length !== 8) {
            setAviso('O CEP deve conter 8 dígitos numéricos.');
            return;
        }

        setAviso(null);
        setSucessoCep(null);
        setBuscandoCep(true);

        try {
            const dados = await buscarEnderecoPorCep(cepParaBusca);
            setLogradouro(dados.logradouro || '');
            setBairro(dados.bairro || '');
            setCidade(dados.localidade || '');
            setUf(dados.uf || '');
            setSucessoCep(`Endereço resolvido: ${dados.localidade}/${dados.uf}`);
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : 'Falha ao buscar CEP.');
        } finally {
            setBuscandoCep(false);
        }
    }

    /** Valida e grava o fornecedor (cria ou atualiza). */
    async function handleSalvar() {
        setAviso(null);

        if (!nome.trim()) {
            setAviso('Razão social ou nome do fornecedor é obrigatório.');
            return;
        }

        setSalvando(true);
        try {
            const dados = {
                nome: nome.trim(),
                telefone: telefone.trim(),
                email: email.trim(),
                cep: cep.trim(),
                logradouro: logradouro.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                uf: uf.trim().toUpperCase(),
            };

            if (editandoId) {
                await atualizarFornecedor(editandoId, dados);
            } else {
                await criarFornecedor(dados);
            }
            limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setSalvando(false);
        }
    }

    /** Remove o fornecedor pelo id. */
    async function handleExcluir(id?: string) {
        if (!id) return;
        setAviso(null);
        try {
            await removerFornecedor(id);
            if (editandoId === id) limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        }
    }

    const termo = busca.toLowerCase();
    const itensFiltrados = lista.filter(
        (item) =>
            item.nome.toLowerCase().includes(termo) ||
            (item.cidade && item.cidade.toLowerCase().includes(termo)) ||
            (item.email && item.email.toLowerCase().includes(termo))
    );

    /** Monta o endereço completo para exibir no card. */
    function textoEndereco(item: Fornecedor) {
        return [
            item.logradouro ? `${item.logradouro}, ` : '',
            item.bairro ? `${item.bairro} — ` : '',
            item.cidade ? `${item.cidade}/${item.uf}` : '',
            item.cep ? ` · CEP ${item.cep}` : '',
        ].join('');
    }

    return (
        <View style={estilos.tela}>
            <BarraBusca
                busca={busca}
                onChangeBusca={setBusca}
                placeholder="Buscar por razão social, cidade..."
                formularioAberto={formularioAberto}
                onToggleFormulario={() => {
                    limparFormulario();
                    if (!formularioAberto) setFormularioAberto(true);
                }}
            />

            {formularioAberto && (
                <CardFormulario
                    titulo={editandoId ? 'ATUALIZAÇÃO DE FORNECEDOR' : 'CADASTRO DE NOVO PARCEIRO'}
                    subtitulo="Módulo com integração automática aos Correios (ViaCEP)."
                >
                    <AlertaMensagem tipo="erro" mensagem={aviso} />
                    <AlertaMensagem tipo="sucesso" mensagem={sucessoCep} />

                    <BlocoSecao titulo="1. DADOS DA EMPRESA">
                        <CampoTexto
                            label="RAZÃO SOCIAL OU NOME FANTASIA *"
                            valor={nome}
                            onChange={setNome}
                            placeholder="Ex: Distribuidora Brasil Tech Ltda"
                        />
                        <CampoTexto
                            label="TELEFONE DE CONTATO"
                            valor={telefone}
                            onChange={setTelefone}
                            placeholder="(00) 00000-0000"
                            keyboardType="phone-pad"
                        />
                        <CampoTexto
                            label="E-MAIL COMERCIAL"
                            valor={email}
                            onChange={setEmail}
                            placeholder="contato@fornecedor.com.br"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            semDivisor
                        />
                    </BlocoSecao>

                    <View style={estilos.secaoBloco}>
                        <Text style={estilos.secaoRotulo}>2. LOGÍSTICA E LOCALIZAÇÃO (VIACEP)</Text>

                        <CampoCep
                            cep={cep}
                            buscando={buscandoCep}
                            onChangeCep={setCep}
                            onBuscar={handleConsultarCep}
                        />

                        <View style={estilos.caixaCamposComMargem}>
                            <CampoTexto
                                label="LOGRADOURO (RUA, AVENIDA)"
                                valor={logradouro}
                                onChange={setLogradouro}
                                placeholder="Ex: Av. Afonso Pena, 1500"
                            />
                            <CampoTexto
                                label="BAIRRO"
                                valor={bairro}
                                onChange={setBairro}
                                placeholder="Ex: Centro"
                            />
                            <View style={estilos.linhaDuplaEquilibrada}>
                                <View style={estilos.colunaCidade}>
                                    <Text style={estilos.labelCampo}>MUNICÍPIO / CIDADE</Text>
                                    <TextInput
                                        style={estilos.inputCampo}
                                        placeholder="Ex: Belo Horizonte"
                                        placeholderTextColor={cores.textoMudo}
                                        value={cidade}
                                        onChangeText={setCidade}
                                    />
                                </View>
                                <View style={estilos.divisorVerticalEsticado} />
                                <View style={estilos.colunaUf}>
                                    <Text style={estilos.labelCampo}>UF</Text>
                                    <TextInput
                                        style={[estilos.inputCampo, estilos.mono]}
                                        placeholder="MG"
                                        placeholderTextColor={cores.textoMudo}
                                        value={uf}
                                        onChangeText={setUf}
                                        maxLength={2}
                                        autoCapitalize="characters"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <BotoesFormulario
                        salvando={salvando}
                        textoSalvar={editandoId ? 'SALVAR ALTERAÇÕES' : 'GRAVAR FORNECEDOR'}
                        onSalvar={handleSalvar}
                        onCancelar={limparFormulario}
                    />
                </CardFormulario>
            )}

            {!formularioAberto && (
                <ListaCadastro
                    titulo="FORNECEDORES HOMOLOGADOS"
                    totalTexto={`${itensFiltrados.length} REGISTROS`}
                    carregando={carregando}
                    textoCarregando="Consultando parceiros..."
                    vazioTitulo="Nenhum fornecedor registrado"
                    vazioSub='Toque em "+ NOVO" acima para cadastrar com validação de CEP.'
                    dados={itensFiltrados}
                    chave={(item) => item.id ?? item.nome}
                    renderItem={(item) => (
                        <View style={estilos.cardItem}>
                            <View style={estilos.itemTopo}>
                                <Text style={estilos.itemNome}>{item.nome}</Text>
                                <Text style={estilos.itemTagMuda}>HOMOLOGADO</Text>
                            </View>

                            <View style={estilos.itemCorpo}>
                                <Text style={estilos.itemDadoRotulo}>CONTATO:</Text>
                                <Text style={estilos.itemDadoValor}>
                                    {item.telefone || 'Sem telefone'} · {item.email || 'Sem e-mail'}
                                </Text>

                                {(item.logradouro || item.cidade || item.cep) && (
                                    <View style={{ marginTop: 6 }}>
                                        <Text style={estilos.itemDadoRotulo}>LOCALIZAÇÃO (VIACEP):</Text>
                                        <Text style={estilos.itemEndereco}>{textoEndereco(item)}</Text>
                                    </View>
                                )}
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
