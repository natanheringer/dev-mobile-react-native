/*** Estilos da tela inicial (HomeScreen). */

import { StyleSheet } from 'react-native';
import { cores } from './cores';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: cores.texto,
    },
});
