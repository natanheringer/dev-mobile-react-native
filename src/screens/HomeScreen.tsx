import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';
import { formatarMoeda } from '../utils/formatar';
import { logoutUsuario } from '../services/authService';
import { observarProdutos } from '../services/produtoService';
import { observarFornecedores } from '../services/fornecedorService';
import { observarFuncionarios } from '../services/funcionarioService';
import { buscarPendentes, observarPendentes } from '../database/sqlite';
import type { Produto } from '../types/Produto';
import LinhaModulo from '../components/LinhaModulo';

/** Painel inicial com totais do estoque e atalhos dos módulos. */
export default function HomeScreen({ navigation, route }: any) {
    const emailUsuario = route?.params?.usuarioEmail || 'operador@empresa.com.br';

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [totalFornecedores, setTotalFornecedores] = useState(0);
    const [totalFuncionarios, setTotalFuncionarios] = useState(0);
    const [totalOfflinePendentes, setTotalOfflinePendentes] = useState(0);

    useEffect(() => {
        const unsubProd = observarProdutos((lista) => setProdutos(lista), () => {});
        const unsubForn = observarFornecedores((lista) => setTotalFornecedores(lista.length), () => {});
        const unsubFunc = observarFuncionarios((lista) => setTotalFuncionarios(lista.length), () => {});

        const atualizarPendentes = () => { void buscarPendentes()
            .then((pendentes) => setTotalOfflinePendentes(pendentes?.length || 0))
            .catch(() => setTotalOfflinePendentes(0)); };
        const cancelarLocal = observarPendentes(atualizarPendentes);
        atualizarPendentes();

        return () => {
            unsubProd();
            unsubForn();
            unsubFunc();
            cancelarLocal();
        };
    }, []);

    const valorTotalEstoque = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
    const totalItensFisicos = produtos.reduce((acc, p) => acc + p.quantidade, 0);

    return (
        <SafeAreaView style={estilos.homeSafe}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.homeScroll}>
                <View style={estilos.homeTopo}>
                    <View style={estilos.flex1}>
                        <Text style={estilos.homeMarca}>STOCKMASTER</Text>
                        <Text style={estilos.homeEmail}>{emailUsuario}</Text>
                    </View>

                    <TouchableOpacity style={estilos.btnSair} onPress={() => logoutUsuario()} activeOpacity={0.7}>
                        <Text style={estilos.btnSairTexto}>ENCERRAR</Text>
                        <Feather name="log-out" size={12} color={cores.textoSecundario} />
                    </TouchableOpacity>
                </View>

                <View style={estilos.homeStatus}>
                    <View style={estilos.pontoOnline} />
                    <Text style={estilos.homeStatusTexto}>GESTÃO DE ESTOQUE · SQLITE + FIRESTORE</Text>
                </View>

                <View style={estilos.homeSecao}>
                    <Text style={estilos.homeSecaoRotulo}>BALANÇO GERAL DE ESTOQUE</Text>
                    <View style={estilos.ledgerCard}>
                        <View style={estilos.ledgerTopo}>
                            <Text style={estilos.ledgerRotulo}>VALOR ESTIMADO DO INVENTÁRIO</Text>
                            <Text style={estilos.ledgerValor}>{formatarMoeda(valorTotalEstoque)}</Text>
                        </View>

                        <View style={estilos.divisorFino} />

                        <View style={estilos.gradeGrid}>
                            <View style={estilos.linhaMetricas}>
                                <View style={estilos.celulaMetrica}>
                                    <Text style={estilos.metricaRotulo}>VOLUME FÍSICO</Text>
                                    <Text style={estilos.metricaValor}>{totalItensFisicos} un</Text>
                                </View>
                                <View style={estilos.separadorVerticalHome} />
                                <View style={estilos.celulaMetrica}>
                                    <Text style={estilos.metricaRotulo}>SKUs REGISTRADOS</Text>
                                    <Text style={estilos.metricaValor}>{produtos.length} produtos</Text>
                                </View>
                            </View>

                            <View style={estilos.divisorFino} />

                            <View style={estilos.linhaMetricas}>
                                <View style={estilos.celulaMetrica}>
                                    <Text style={estilos.metricaRotulo}>FORNECEDORES</Text>
                                    <Text style={estilos.metricaValor}>{totalFornecedores} parceiros</Text>
                                </View>
                                <View style={estilos.separadorVerticalHome} />
                                <View style={estilos.celulaMetrica}>
                                    <Text style={estilos.metricaRotulo}>EQUIPE INTERNA</Text>
                                    <Text style={estilos.metricaValor}>{totalFuncionarios} membros</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={estilos.homeSecao}>
                    <Text style={estilos.homeSecaoRotulo}>MÓDULOS DE CONTROLE OPERACIONAL</Text>
                    <View style={estilos.tabelaAgrupada}>
                        <LinhaModulo
                            icone="box"
                            titulo="Catálogo de Produtos"
                            subtitulo="Precificação, níveis de estoque e códigos SKU"
                            contador={`${produtos.length} itens`}
                            onPress={() => navigation.navigate('Produtos')}
                        />
                        <View style={estilos.divisorFino} />
                        <LinhaModulo
                            icone="map-pin"
                            titulo="Fornecedores e Logística"
                            subtitulo="Cadastro corporativo e consulta ViaCEP"
                            contador={`${totalFornecedores} reg`}
                            onPress={() => navigation.navigate('Fornecedores')}
                        />
                        <View style={estilos.divisorFino} />
                        <LinhaModulo
                            icone="users"
                            titulo="Quadro de Funcionários"
                            subtitulo="Persistência SQLite e espelhamento Cloud"
                            contador={
                                totalOfflinePendentes > 0
                                    ? `${totalOfflinePendentes} pendentes`
                                    : `${totalFuncionarios} membros`
                            }
                            aviso={totalOfflinePendentes > 0}
                            onPress={() => navigation.navigate('Funcionarios')}
                        />
                    </View>
                </View>

                <View style={estilos.homeRodape}>
                    <Text style={estilos.homeRodapeTexto}>
                        SISTEMA DE GESTÃO DE ESTOQUE · DESENVOLVIMENTO MOBILE
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
