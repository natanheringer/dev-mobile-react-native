import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';

interface Props {
    titulo: string;
    children: React.ReactNode;
}

/** Bloco de campos com rótulo de seção. */
export default function BlocoSecao({ titulo, children }: Props) {
    return (
        <View style={estilos.secaoBloco}>
            <Text style={estilos.secaoRotulo}>{titulo}</Text>
            <View style={estilos.caixaCampos}>{children}</View>
        </View>
    );
}
