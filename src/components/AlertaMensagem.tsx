import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';

interface Props {
    tipo: 'erro' | 'sucesso';
    mensagem: string | null;
}

/** Faixa de erro ou sucesso; some se não houver mensagem. */
export default function AlertaMensagem({ tipo, mensagem }: Props) {
    if (!mensagem) return null;

    const estiloCaixa = tipo === 'erro' ? estilos.alertaErro : estilos.alertaSucesso;
    const estiloTexto = tipo === 'erro' ? estilos.alertaErroTexto : estilos.alertaSucessoTexto;

    return (
        <View style={estiloCaixa}>
            <Text style={estiloTexto}>{mensagem}</Text>
        </View>
    );
}
