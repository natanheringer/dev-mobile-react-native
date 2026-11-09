import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cores } from '../styles/cores';
import { estilos } from '../styles/estilosCompartilhados';

type Props = {
    icone: React.ComponentProps<typeof Feather>['name'];
    titulo: string;
    subtitulo: string;
    contador: string;
    aviso?: boolean;
    onPress: () => void;
};

/** Linha clicável de um módulo na home. */
export default function LinhaModulo({ icone, titulo, subtitulo, contador, aviso, onPress }: Props) {
    return (
        <TouchableOpacity style={estilos.tabelaLinha} onPress={onPress} activeOpacity={0.65}>
            <View style={estilos.linhaIcone}>
                <Feather name={icone} size={18} color={cores.preto} />
            </View>
            <View style={estilos.linhaConteudo}>
                <Text style={estilos.linhaTitulo}>{titulo}</Text>
                <Text style={estilos.linhaSubtitulo}>{subtitulo}</Text>
            </View>
            <View style={estilos.linhaAcessorio}>
                <Text style={aviso ? estilos.linhaContadorAviso : estilos.linhaContador}>{contador}</Text>
                <Feather name="chevron-right" size={16} color={cores.textoMudo} />
            </View>
        </TouchableOpacity>
    );
}
