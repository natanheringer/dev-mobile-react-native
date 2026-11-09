import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';
import { formatarMoeda } from '../utils/formatar';
import type { Produto } from '../types/Produto';
import {
    observarProdutos,
    criarProduto,
    atualizarProduto,
    removerProduto,
} from '../services/produtoService';
import BarraBusca from '../components/BarraBusca';
import BlocoSecao from '../components/BlocoSecao';
import CampoTexto from '../components/CampoTexto';
import AlertaMensagem from '../components/AlertaMensagem';
import CardFormulario from '../components/CardFormulario';
import BotoesFormulario from '../components/BotoesFormulario';
import ListaCadastro from '../components/ListaCadastro';
import AcoesItem from '../components/AcoesItem';

/** CRUD de produtos (lista, cadastro, edição e exclusão). */
export default function ProdutosScreen() {
    const [lista, setLista] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [busca, setBusca] = useState('');
    const [aviso, setAviso] = useState<string | null>(null);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');

    useEffect(() => {
        return observarProdutos(
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
        setCodigo('');
        setCategoria('');
        setQuantidade('');
        setPreco('');
        setFormularioAberto(false);
        setAviso(null);
    }

    /** Abre o formulário preenchido com o item escolhido. */
    function iniciarEdicao(item: Produto) {
        setEditandoId(item.id ?? null);
        setNome(item.nome);
        setCodigo(item.codigo);
        setCategoria(item.categoria ?? '');
        setQuantidade(String(item.quantidade));
        setPreco(item.preco ? item.preco.toFixed(2) : '');
        setFormularioAberto(true);
        setAviso(null);
    }

    /** Valida e grava o produto (cria ou atualiza). */
    async function handleSalvar() {
        setAviso(null);
        const qtdNum = parseInt(quantidade, 10);
        const precoNum = parseFloat(preco.replace(',', '.'));

        if (!nome.trim() || !codigo.trim()) {
            setAviso('Nome do produto e código SKU são obrigatórios.');
            return;
        }
        if (isNaN(qtdNum) || isNaN(precoNum)) {
            setAviso('Informe valores numéricos válidos para quantidade e preço.');
            return;
        }

        setSalvando(true);
        try {
            const dados = {
                nome: nome.trim(),
                codigo: codigo.trim().toUpperCase(),
                categoria: categoria.trim() || 'Geral',
                quantidade: qtdNum,
                preco: precoNum,
            };

            if (editandoId) {
                await atualizarProduto(editandoId, dados);
            } else {
                await criarProduto(dados);
            }
            limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setSalvando(false);
        }
    }

    /** Remove o produto pelo id. */
    async function handleExcluir(id?: string) {
        if (!id) return;
        setAviso(null);
        try {
            await removerProduto(id);
            if (editandoId === id) limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        }
    }

    const termo = busca.toLowerCase();
    const itensFiltrados = lista.filter(
        (item) =>
            item.nome.toLowerCase().includes(termo) ||
            item.codigo.toLowerCase().includes(termo) ||
            (item.categoria && item.categoria.toLowerCase().includes(termo))
    );

    const subtotalCalculado =
        (parseInt(quantidade, 10) || 0) * (parseFloat(preco.replace(',', '.')) || 0);

    /** Cor do selo de estoque (esgotado / baixo / regular). */
    function corStatus(quantidadeItem: number) {
        if (quantidadeItem <= 0) return cores.erro;
        if (quantidadeItem <= 5) return cores.aviso;
        return cores.sucesso;
    }

    /** Texto do selo de estoque. */
    function textoStatus(quantidadeItem: number) {
        if (quantidadeItem <= 0) return 'ESGOTADO';
        if (quantidadeItem <= 5) return 'BAIXO';
        return 'REGULAR';
    }

    return (
        <View style={estilos.tela}>
            <BarraBusca
                busca={busca}
                onChangeBusca={setBusca}
                placeholder="Buscar no inventário..."
                formularioAberto={formularioAberto}
                onToggleFormulario={() => {
                    limparFormulario();
                    if (!formularioAberto) setFormularioAberto(true);
                }}
            />

            {formularioAberto && (
                <CardFormulario
                    titulo={editandoId ? 'ATUALIZAÇÃO DE CADASTRO' : 'NOVO REGISTRO DE ITEM'}
                    subtitulo="Preencha os blocos abaixo para gravar no Firestore."
                >
                    <AlertaMensagem tipo="erro" mensagem={aviso} />

                    <BlocoSecao titulo="1. IDENTIFICAÇÃO DO ITEM">
                        <CampoTexto
                            label="DESCRIÇÃO COMPLETA *"
                            valor={nome}
                            onChange={setNome}
                            placeholder="Ex: Monitor Dell 27"
                        />
                        <CampoTexto
                            label="CÓDIGO SKU / IDENTIFICADOR *"
                            valor={codigo}
                            onChange={setCodigo}
                            placeholder="Ex: SKU-99401"
                            autoCapitalize="characters"
                            mono
                        />
                        <CampoTexto
                            label="CATEGORIA / DEPARTAMENTO"
                            valor={categoria}
                            onChange={setCategoria}
                            placeholder="Ex: Informática, Mobiliário, etc."
                            semDivisor
                        />
                    </BlocoSecao>

                    <BlocoSecao titulo="2. INVENTÁRIO E VALORES">
                        <CampoTexto
                            label="QUANTIDADE FÍSICA EM ESTOQUE *"
                            valor={quantidade}
                            onChange={setQuantidade}
                            placeholder="0"
                            keyboardType="numeric"
                            mono
                        />
                        <CampoTexto
                            label="PREÇO UNITÁRIO DE VENDA (R$) *"
                            valor={preco}
                            onChange={setPreco}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            mono
                            semDivisor
                        />
                    </BlocoSecao>

                    {subtotalCalculado > 0 && (
                        <View style={estilos.blocoCalculo}>
                            <Text style={estilos.blocoCalculoRotulo}>SUBTOTAL CALCULADO DO LOTE</Text>
                            <Text style={estilos.blocoCalculoValor}>{formatarMoeda(subtotalCalculado)}</Text>
                        </View>
                    )}

                    <BotoesFormulario
                        salvando={salvando}
                        textoSalvar={editandoId ? 'SALVAR ALTERAÇÕES' : 'GRAVAR ITEM NO BANCO'}
                        onSalvar={handleSalvar}
                        onCancelar={limparFormulario}
                    />
                </CardFormulario>
            )}

            {!formularioAberto && (
                <ListaCadastro
                    titulo="CATÁLOGO ATUAL"
                    totalTexto={`${itensFiltrados.length} ITENS REGISTRADOS`}
                    carregando={carregando}
                    textoCarregando="Consultando banco de dados..."
                    vazioTitulo="Nenhum produto cadastrado"
                    vazioSub='Toque em "+ NOVO" acima para adicionar o primeiro item ao inventário.'
                    dados={itensFiltrados}
                    chave={(item) => item.id ?? item.codigo}
                    renderItem={(item) => {
                        const total = item.preco * item.quantidade;
                        return (
                            <View style={estilos.cardItem}>
                                <View style={estilos.itemTopoInicio}>
                                    <View style={estilos.flex1}>
                                        <Text style={estilos.itemNome}>{item.nome}</Text>
                                        <Text style={estilos.itemMeta}>
                                            {item.codigo} · {item.categoria || 'Geral'}
                                        </Text>
                                    </View>
                                    <Text style={[estilos.itemTagStatus, { color: corStatus(item.quantidade) }]}>
                                        {textoStatus(item.quantidade)}
                                    </Text>
                                </View>

                                <View style={estilos.itemValoresGrade}>
                                    <View style={estilos.itemValorColuna}>
                                        <Text style={estilos.itemValorLabel}>UNITÁRIO</Text>
                                        <Text style={estilos.itemValorNumero}>{formatarMoeda(item.preco)}</Text>
                                    </View>
                                    <View style={estilos.divisorVertical} />
                                    <View style={estilos.itemValorColuna}>
                                        <Text style={estilos.itemValorLabel}>SALDO</Text>
                                        <Text style={estilos.itemValorNumero}>{item.quantidade} un</Text>
                                    </View>
                                    <View style={estilos.divisorVertical} />
                                    <View style={estilos.itemValorColuna}>
                                        <Text style={estilos.itemValorLabel}>TOTAL LOTE</Text>
                                        <Text style={[estilos.itemValorNumero, { fontWeight: '800' }]}>
                                            {formatarMoeda(total)}
                                        </Text>
                                    </View>
                                </View>

                                <AcoesItem
                                    onEditar={() => iniciarEdicao(item)}
                                    onExcluir={() => handleExcluir(item.id)}
                                />
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}
