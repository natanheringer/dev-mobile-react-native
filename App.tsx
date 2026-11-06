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

/*** Rotas e os parametros que cada uma recebe (nenhuma recebe por enquanto). */
export type RotasApp = {
    Home: undefined;
    Funcionarios: undefined;
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
                        name="Funcionarios"
                        component={FuncionariosScreen}
                        options={{ title: 'Funcionários' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
