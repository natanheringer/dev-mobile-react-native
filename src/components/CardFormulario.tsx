import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';

type Props = {
    titulo: string;
    subtitulo: string;
    children: React.ReactNode;
};

/** Card rolável do formulário de cadastro/edição. */
export default function CardFormulario({ titulo, subtitulo, children }: Props) {
    return (
        <ScrollView style={estilos.scrollFormulario} showsVerticalScrollIndicator={false}>
            <View style={estilos.cardFormulario}>
                <View style={estilos.cabecalhoFormulario}>
                    <Text style={estilos.tituloFormulario}>{titulo}</Text>
                    <Text style={estilos.subtituloFormulario}>{subtitulo}</Text>
                </View>
                {children}
            </View>
        </ScrollView>
    );
}
