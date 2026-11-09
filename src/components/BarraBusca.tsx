import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from '../styles/estilosCompartilhados';
import { cores } from '../styles/cores';

interface Props {
    busca: string;
    onChangeBusca: (texto: string) => void;
    placeholder?: string;
    formularioAberto: boolean;
    onToggleFormulario: () => void;
}

/** Campo de busca + botão para abrir/fechar o formulário. */
export default function BarraBusca({
    busca,
    onChangeBusca,
    placeholder = 'Buscar...',
    formularioAberto,
    onToggleFormulario,
}: Props) {
    return (
        <View style={estilos.barraComando}>
            <View style={estilos.campoBusca}>
                <Feather name="search" size={15} color={cores.textoMudo} style={{ marginRight: 8 }} />
                <TextInput
                    style={estilos.inputBusca}
                    placeholder={placeholder}
                    placeholderTextColor={cores.textoMudo}
                    value={busca}
                    onChangeText={onChangeBusca}
                />
                {busca.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeBusca('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Feather name="x" size={14} color={cores.textoMudo} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[estilos.btnToggle, formularioAberto && estilos.btnToggleAtivo]}
                onPress={onToggleFormulario}
                activeOpacity={0.8}
            >
                <Text style={[estilos.btnToggleTexto, formularioAberto && estilos.btnToggleTextoAtivo]}>
                    {formularioAberto ? 'FECHAR' : '+ NOVO'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
