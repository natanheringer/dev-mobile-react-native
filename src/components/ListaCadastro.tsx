import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';

type Props<T> = {
    titulo: string;
    totalTexto: string;
    carregando: boolean;
    textoCarregando: string;
    vazioTitulo: string;
    vazioSub: string;
    dados: T[];
    chave: (item: T) => string;
    renderItem: (item: T) => React.ReactElement;
};

/** Lista de cadastro: cabeçalho, loading, vazio e itens. */
export default function ListaCadastro<T>({
    titulo,
    totalTexto,
    carregando,
    textoCarregando,
    vazioTitulo,
    vazioSub,
    dados,
    chave,
    renderItem,
}: Props<T>) {
    return (
        <>
            <View style={estilos.cabecalhoLista}>
                <Text style={estilos.cabecalhoListaTitulo}>{titulo}</Text>
                <Text style={estilos.cabecalhoListaTotal}>{totalTexto}</Text>
            </View>

            {carregando ? (
                <View style={estilos.loadingContainer}>
                    <ActivityIndicator size="small" color={cores.preto} />
                    <Text style={estilos.loadingTexto}>{textoCarregando}</Text>
                </View>
            ) : (
                <FlatList
                    data={dados}
                    keyExtractor={chave}
                    contentContainerStyle={estilos.listaConteudo}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={estilos.blocoVazio}>
                            <Text style={estilos.blocoVazioTitulo}>{vazioTitulo}</Text>
                            <Text style={estilos.blocoVazioSub}>{vazioSub}</Text>
                        </View>
                    }
                    renderItem={({ item }) => renderItem(item)}
                />
            )}
        </>
    );
}
