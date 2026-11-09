import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';

type Props = {
    salvando: boolean;
    textoSalvar: string;
    onSalvar: () => void;
    onCancelar: () => void;
};

/** Botões Salvar e Cancelar do formulário. */
export default function BotoesFormulario({ salvando, textoSalvar, onSalvar, onCancelar }: Props) {
    return (
        <View style={estilos.acoesBloco}>
            <TouchableOpacity
                style={estilos.btnConfirmar}
                onPress={onSalvar}
                disabled={salvando}
                activeOpacity={0.85}
            >
                {salvando ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <Text style={estilos.btnConfirmarTexto}>{textoSalvar}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={estilos.btnDescartar} onPress={onCancelar} activeOpacity={0.7}>
                <Text style={estilos.btnDescartarTexto}>CANCELAR OPERAÇÃO</Text>
            </TouchableOpacity>
        </View>
    );
}
