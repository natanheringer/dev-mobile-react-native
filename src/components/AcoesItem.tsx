import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';

type Props = {
    onEditar: () => void;
    onExcluir: () => void;
};

/** Botões Editar e Excluir de um card da lista. */
export default function AcoesItem({ onEditar, onExcluir }: Props) {
    return (
        <View style={estilos.itemRodapeAcoes}>
            <TouchableOpacity style={estilos.btnAcaoItem} onPress={onEditar} activeOpacity={0.7}>
                <Feather name="edit-2" size={12} color={cores.textoSecundario} style={estilos.iconeAcao} />
                <Text style={estilos.btnAcaoItemTexto}>EDITAR</Text>
            </TouchableOpacity>

            <View style={estilos.divisorAcaoItem} />

            <TouchableOpacity style={estilos.btnAcaoItem} onPress={onExcluir} activeOpacity={0.7}>
                <Feather name="trash-2" size={12} color={cores.erro} style={estilos.iconeAcao} />
                <Text style={[estilos.btnAcaoItemTexto, estilos.textoErro]}>EXCLUIR</Text>
            </TouchableOpacity>
        </View>
    );
}
