import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen ({ navigation }: any) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Menu Principal</Text>
        <Button
        title="Controle de Estoque" 
        onPress={() => navigation.navigate('Funcionarios')}
        />
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
});