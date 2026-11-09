import React from 'react';
import { View, Text, TextInput, type KeyboardTypeOptions } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';
import { cores } from '../styles/cores';

interface Props {
    label: string;
    valor: string;
    onChange: (texto: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    secureTextEntry?: boolean;
    mono?: boolean;
    maxLength?: number;
    semDivisor?: boolean;
}

/** Um campo de formulário: rótulo + input. */
export default function CampoTexto({
    label,
    valor,
    onChange,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    secureTextEntry = false,
    mono = false,
    maxLength,
    semDivisor = false,
}: Props) {
    return (
        <>
            <View style={estilos.linhaCampo}>
                <Text style={estilos.labelCampo}>{label}</Text>
                <TextInput
                    style={[estilos.inputCampo, mono && estilos.mono]}
                    placeholder={placeholder}
                    placeholderTextColor={cores.textoMudo}
                    value={valor}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry}
                    maxLength={maxLength}
                />
            </View>
            {!semDivisor && <View style={estilos.divisorCampo} />}
        </>
    );
}
