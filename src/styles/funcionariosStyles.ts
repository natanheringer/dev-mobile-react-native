/*** Estilos da tela de funcionarios (FuncionariosScreen). */

import { StyleSheet } from 'react-native';
import { cores } from './cores';

export const funcionariosStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    campo: {
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 8,
        color: cores.texto,
    },
    botoes: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    aviso: {
        color: cores.erro,
        marginBottom: 12,
    },
    espera: {
        marginTop: 24,
    },
    vazio: {
        textAlign: 'center',
        color: cores.textoApagado,
        marginTop: 24,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaLeve,
        paddingVertical: 10,
    },
    itemTexto: {
        flex: 1,
        paddingRight: 12,
    },
    itemNome: {
        fontSize: 16,
        fontWeight: '600',
        color: cores.texto,
    },
    itemDetalhe: {
        color: cores.textoFraco,
    },
    itemPendente: {
        color: cores.textoApagado,
        fontSize: 12,
        fontStyle: 'italic',
    },
});
