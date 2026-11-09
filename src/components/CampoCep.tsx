import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';

type Props = {
    cep: string;
    buscando: boolean;
    onChangeCep: (texto: string) => void;
    onBuscar: (cepManual?: string) => void;
};

/** Campo de CEP com busca automática ao completar 8 dígitos. */
export default function CampoCep({ cep, buscando, onChangeCep, onBuscar }: Props) {
    return (
        <View style={estilos.caixaCep}>
            <View style={estilos.flex1}>
                <Text style={estilos.labelCampo}>CÓDIGO POSTAL (CEP)</Text>
                <TextInput
                    style={[estilos.inputCampo, estilos.mono]}
                    placeholder="00000-000"
                    placeholderTextColor={cores.textoMudo}
                    value={cep}
                    onChangeText={(texto) => {
                        onChangeCep(texto);
                        const soNumeros = texto.replace(/\D/g, '');
                        if (soNumeros.length === 8) onBuscar(soNumeros);
                    }}
                    keyboardType="numeric"
                    maxLength={9}
                />
            </View>
            <TouchableOpacity
                style={estilos.btnBuscarCep}
                onPress={() => onBuscar()}
                disabled={buscando}
                activeOpacity={0.8}
            >
                {buscando ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={estilos.btnBuscarCepTexto}>BUSCAR CEP</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
