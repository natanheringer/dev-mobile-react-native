/***
    Estilos Compartilhados do Aplicativo (Design System Minimalista).
    Centraliza a tipografia, espaçamentos, formulários e listas de todos os módulos.
*/

import { StyleSheet, Platform } from 'react-native';
import { cores } from './cores';

export const estilos = StyleSheet.create({
    // Estrutura de Tela
    tela: {
        flex: 1,
        backgroundColor: cores.fundo,
        paddingHorizontal: 16,
        paddingTop: 12,
    },

    // Barra de Comando Superior (Busca + Botão de Ação)
    barraComando: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    campoBusca: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        paddingHorizontal: 12,
        height: 42,
    },
    inputBusca: {
        flex: 1,
        fontSize: 13,
        color: cores.texto,
    },
    btnToggle: {
        backgroundColor: cores.preto,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
        borderRadius: 6,
        height: 42,
    },
    btnToggleAtivo: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    btnToggleTexto: {
        color: cores.textoInvertido,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    btnToggleTextoAtivo: {
        color: cores.textoSecundario,
    },

    // Faixa Técnica de Status de Rede e Sincronização
    barraStatusRede: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        marginBottom: 12,
    },
    statusLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pontoStatus: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusTexto: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoSecundario,
        letterSpacing: 1,
    },
    btnSync: {
        backgroundColor: cores.aviso,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    btnSyncTexto: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoInvertido,
        letterSpacing: 0.8,
    },
    syncStatusTexto: {
        fontSize: 9,
        fontWeight: '700',
        color: cores.textoMudo,
        letterSpacing: 0.8,
    },

    // Alertas e Mensagens de Feedback
    alertaErro: {
        borderLeftWidth: 3,
        borderLeftColor: cores.erro,
        backgroundColor: '#FEF3F2',
        padding: 10,
        marginBottom: 16,
        borderRadius: 2,
    },
    alertaErroTexto: {
        fontSize: 12,
        color: cores.erro,
        fontWeight: '600',
    },
    alertaSucesso: {
        borderLeftWidth: 3,
        borderLeftColor: cores.sucesso,
        backgroundColor: '#ECFDF3',
        padding: 10,
        marginBottom: 16,
        borderRadius: 2,
    },
    alertaSucessoTexto: {
        fontSize: 12,
        color: cores.sucesso,
        fontWeight: '600',
    },

    // Formulários e Campos
    scrollFormulario: {
        flex: 1,
        marginBottom: 16,
    },
    cardFormulario: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        padding: 16,
    },
    cabecalhoFormulario: {
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaFina,
        paddingBottom: 12,
        marginBottom: 16,
    },
    tituloFormulario: {
        fontSize: 12,
        fontWeight: '900',
        color: cores.preto,
        letterSpacing: 1.2,
    },
    subtituloFormulario: {
        fontSize: 11,
        color: cores.textoSecundario,
        marginTop: 2,
    },
    secaoBloco: {
        marginBottom: 18,
    },
    secaoRotulo: {
        fontSize: 10,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    caixaCampos: {
        backgroundColor: cores.superficieAlt,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        overflow: 'hidden',
    },
    linhaCampo: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    divisorCampo: {
        height: 1,
        backgroundColor: cores.bordaFina,
    },
    labelCampo: {
        fontSize: 9,
        fontWeight: '700',
        color: cores.textoSecundario,
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    inputCampo: {
        fontSize: 14,
        color: cores.texto,
        paddingVertical: 4,
    },
    mono: {
        fontFamily: Platform.select({ web: 'monospace, monospace', default: 'monospace' }),
    },
    acoesBloco: {
        marginTop: 8,
        gap: 8,
    },
    btnConfirmar: {
        backgroundColor: cores.preto,
        borderRadius: 6,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnConfirmarTexto: {
        color: cores.textoInvertido,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
    btnDescartar: {
        borderRadius: 6,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: cores.borda,
    },
    btnDescartarTexto: {
        color: cores.textoSecundario,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },

    // Bloco CEP & Botão de Busca
    caixaCep: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: cores.superficieAlt,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 12,
    },
    btnBuscarCep: {
        backgroundColor: cores.preto,
        paddingHorizontal: 12,
        height: 36,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBuscarCepTexto: {
        color: cores.textoInvertido,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    linhaDuplaEquilibrada: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    // Bloco de Cálculo de Lote
    blocoCalculo: {
        marginBottom: 16,
        backgroundColor: cores.superficieAlt,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    blocoCalculoRotulo: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoSecundario,
        letterSpacing: 0.8,
    },
    blocoCalculoValor: {
        fontSize: 15,
        fontWeight: '900',
        color: cores.preto,
        fontFamily: Platform.select({ web: 'monospace, monospace', default: 'monospace' }),
    },

    // Bloco Informativo de Arquitetura
    blocoInformativo: {
        backgroundColor: cores.superficieAlt,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        padding: 12,
    },
    blocoInformativoTitulo: {
        fontSize: 8,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    blocoInformativoTexto: {
        fontSize: 11,
        color: cores.textoSecundario,
        lineHeight: 16,
    },

    // Listagens e Cards de Itens
    cabecalhoLista: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 2,
        marginBottom: 8,
    },
    cabecalhoListaTitulo: {
        fontSize: 10,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1.2,
    },
    cabecalhoListaTotal: {
        fontSize: 10,
        fontWeight: '700',
        color: cores.textoMudo,
        letterSpacing: 0.8,
    },
    listaConteudo: {
        paddingBottom: 24,
    },
    cardItem: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
    },
    itemTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaFina,
    },
    itemNome: {
        fontSize: 14,
        fontWeight: '800',
        color: cores.preto,
    },
    itemMeta: {
        fontSize: 11,
        color: cores.textoSecundario,
        marginTop: 2,
        fontFamily: Platform.select({ web: 'monospace, monospace', default: 'monospace' }),
    },
    itemTagStatus: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    itemCorpo: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: cores.superficieAlt,
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaFina,
    },
    itemDadoRotulo: {
        fontSize: 8,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 0.8,
        marginBottom: 1,
    },
    itemDadoValor: {
        fontSize: 12,
        color: cores.texto,
    },
    itemValoresGrade: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: cores.superficieAlt,
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaFina,
    },
    itemValorColuna: {
        flex: 1,
        alignItems: 'center',
    },
    divisorVertical: {
        width: 1,
        height: 20,
        backgroundColor: cores.bordaFina,
    },
    itemValorLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    itemValorNumero: {
        fontSize: 12,
        fontWeight: '700',
        color: cores.preto,
        fontFamily: Platform.select({ web: 'monospace, monospace', default: 'monospace' }),
    },
    itemRodapeAcoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    btnAcaoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    btnAcaoItemTexto: {
        fontSize: 10,
        fontWeight: '800',
        color: cores.textoSecundario,
        letterSpacing: 0.8,
    },
    divisorAcaoItem: {
        width: 1,
        height: 12,
        backgroundColor: cores.borda,
        marginHorizontal: 4,
    },

    // Estado Vazio e Carregamento
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingTexto: {
        fontSize: 12,
        color: cores.textoMudo,
        marginTop: 8,
    },
    blocoVazio: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        padding: 32,
        alignItems: 'center',
    },
    blocoVazioTitulo: {
        fontSize: 13,
        fontWeight: '700',
        color: cores.preto,
    },
    blocoVazioSub: {
        fontSize: 11,
        color: cores.textoMudo,
        textAlign: 'center',
        marginTop: 4,
    },

    itemTopoInicio: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaFina,
    },
    itemEndereco: {
        fontSize: 11,
        color: cores.textoSecundario,
        lineHeight: 16,
    },
    itemTagMuda: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 0.8,
    },
    divisorVerticalEsticado: {
        width: 1,
        backgroundColor: cores.bordaFina,
    },
    caixaCamposComMargem: {
        backgroundColor: cores.superficieAlt,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 8,
    },
    iconeAcao: {
        marginRight: 4,
    },
    textoErro: {
        color: cores.erro,
    },
    textoAviso: {
        color: cores.aviso,
    },
    flex1: {
        flex: 1,
    },
    colunaCidade: {
        flex: 2.5,
        paddingRight: 8,
    },
    colunaUf: {
        flex: 1,
        paddingLeft: 8,
    },

    // Login
    loginScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 36,
    },
    loginPainel: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    loginMarca: {
        marginBottom: 28,
        alignItems: 'center',
    },
    loginSubtitulo: {
        fontSize: 10,
        fontWeight: '700',
        color: cores.textoMudo,
        letterSpacing: 2,
        marginBottom: 6,
    },
    loginTitulo: {
        fontSize: 26,
        fontWeight: '900',
        color: cores.preto,
        letterSpacing: 3,
    },
    loginLinha: {
        width: 36,
        height: 2,
        backgroundColor: cores.preto,
        marginTop: 10,
    },
    seletorSegmentado: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        backgroundColor: cores.fundo,
        padding: 2,
        marginBottom: 20,
    },
    segmento: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 4,
    },
    segmentoAtivo: {
        backgroundColor: cores.preto,
    },
    segmentoTexto: {
        fontSize: 11,
        fontWeight: '700',
        color: cores.textoSecundario,
        letterSpacing: 1,
    },
    segmentoTextoAtivo: {
        color: cores.textoInvertido,
    },
    loginRodape: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 9,
        fontWeight: '700',
        color: cores.textoMudo,
        letterSpacing: 1.5,
    },

    // Home
    homeSafe: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    homeScroll: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 36,
    },
    homeTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: cores.borda,
        marginBottom: 10,
    },
    homeMarca: {
        fontSize: 14,
        fontWeight: '900',
        color: cores.preto,
        letterSpacing: 2,
    },
    homeEmail: {
        fontSize: 12,
        color: cores.textoSecundario,
        marginTop: 2,
        fontFamily: Platform.select({ web: 'system-ui, sans-serif' }),
    },
    btnSair: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: cores.superficie,
    },
    btnSairTexto: {
        fontSize: 10,
        fontWeight: '800',
        color: cores.textoSecundario,
        letterSpacing: 0.8,
    },
    homeStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    pontoOnline: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: cores.sucesso,
    },
    homeStatusTexto: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1,
    },
    homeSecao: {
        marginBottom: 20,
    },
    homeSecaoRotulo: {
        fontSize: 10,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1.2,
        marginBottom: 8,
        paddingHorizontal: 2,
    },
    ledgerCard: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        overflow: 'hidden',
    },
    ledgerTopo: {
        padding: 16,
    },
    ledgerRotulo: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    ledgerValor: {
        fontSize: 26,
        fontWeight: '900',
        color: cores.preto,
        letterSpacing: -0.5,
    },
    divisorFino: {
        height: 1,
        backgroundColor: cores.bordaFina,
    },
    gradeGrid: {
        backgroundColor: cores.superficieAlt,
    },
    linhaMetricas: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    celulaMetrica: {
        flex: 1,
    },
    metricaRotulo: {
        fontSize: 8,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    metricaValor: {
        fontSize: 13,
        fontWeight: '800',
        color: cores.preto,
        fontFamily: Platform.select({ web: 'monospace, monospace', default: 'monospace' }),
    },
    separadorVerticalHome: {
        width: 1,
        height: 24,
        backgroundColor: cores.bordaFina,
        marginHorizontal: 12,
    },
    tabelaAgrupada: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        overflow: 'hidden',
    },
    tabelaLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    linhaIcone: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: cores.fundo,
        borderWidth: 1,
        borderColor: cores.borda,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    linhaConteudo: {
        flex: 1,
        paddingRight: 8,
    },
    linhaTitulo: {
        fontSize: 14,
        fontWeight: '800',
        color: cores.preto,
        marginBottom: 2,
    },
    linhaSubtitulo: {
        fontSize: 11,
        color: cores.textoSecundario,
        lineHeight: 15,
    },
    linhaAcessorio: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    linhaContador: {
        fontSize: 11,
        color: cores.textoMudo,
        fontWeight: '700',
    },
    linhaContadorAviso: {
        fontSize: 11,
        color: cores.aviso,
        fontWeight: '800',
    },
    homeRodape: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    homeRodapeTexto: {
        fontSize: 9,
        fontWeight: '800',
        color: cores.textoMudo,
        letterSpacing: 1.2,
    },
    splash: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: cores.fundo,
    },
    splashTexto: {
        marginTop: 12,
        color: cores.textoMudo,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
});
