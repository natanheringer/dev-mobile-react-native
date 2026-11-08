/***

    Ponto de entrada do aplicativo: monta a navegacao em pilha entre as
    telas registradas.

*/

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import FuncionariosScreen from './src/screens/FuncionariosScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import FornecedoresScreen from './src/screens/FornecedoresScreen';

/*** Rotas e os parametros que cada uma recebe (nenhuma recebe por enquanto). */
export type RotasApp = {
    Home: undefined;
    Funcionarios: undefined;
    Produtos: undefined;
    Fornecedores: undefined;
};

const Stack = createNativeStackNavigator<RotasApp>();

export default function App() {
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
