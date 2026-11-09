/***
    Ponto de entrada do aplicativo: monta a navegacao em pilha entre as
    telas registradas.
*/

// 1. ADICIONEI O useEffect AQUI:
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import FuncionariosScreen from './src/screens/FuncionariosScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import FornecedoresScreen from './src/screens/FornecedoresScreen';

// 2. A SUA IMPORTAÇÃO DO BANCO DE DADOS AQUI:
import { inicializarTabelas } from './src/database/sqlite';

/*** Rotas e os parametros que cada uma recebe (nenhuma recebe por enquanto). */
export type RotasApp = {
    Home: undefined;
    Funcionarios: undefined;
    Produtos: undefined;
    Fornecedores: undefined;
};

const Stack = createNativeStackNavigator<RotasApp>();

export default function App() {
    
    // 3. O SEU CÓDIGO AQUI: Executa a criação das tabelas assim que o app abre
    useEffect(() => {
        inicializarTabelas()
            .then(() => console.log('Banco de dados offline pronto!'))
            .catch((erro) => console.error('Erro no SQLite:', erro));
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Início' }}
                    />
                    <Stack.Screen
                        name="Produtos"
                        component={ProdutosScreen}
                        options={{ title: 'Produtos' }}
                    />
                    <Stack.Screen
                        name="Fornecedores"
                        component={FornecedoresScreen}
                        options={{ title: 'Fornecedores' }}
                    />
                    <Stack.Screen
                        name="Funcionarios"
                        component={FuncionariosScreen}
                        options={{ title: 'Funcionários' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}