import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RotasApp } from '../../App';
import { homeStyles as styles } from '../styles/homeStyles';

type Props = NativeStackScreenProps<RotasApp, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu Principal</Text>
            <Button
                title="Cadastro de Funcionários"
                onPress={() => navigation.navigate('Funcionarios')}
            />
        </View>
    );
}
