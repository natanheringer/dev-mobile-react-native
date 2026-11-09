/***
    Ponto de Entrada do Aplicativo — StockMaster (2014 SOTA High-Tier).
    Autenticação com Firebase, controle de rotas restritas e inicialização do SQLite.
*/

import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import FuncionariosScreen from './src/screens/FuncionariosScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import FornecedoresScreen from './src/screens/FornecedoresScreen';

import { inicializarTabelas } from './src/database/sqlite';
import { observarAuth, type UsuarioApp } from './src/services/authService';
import { iniciarSincronizacao } from './src/services/sincronizacaoService';
import { cores } from './src/styles/cores';
import { estilos } from './src/styles/estilosCompartilhados';

export type RotasApp = {
    Home: { usuarioEmail?: string | null } | undefined;
    Funcionarios: undefined;
    Produtos: undefined;
    Fornecedores: undefined;
};

const Stack = createNativeStackNavigator<RotasApp>();

/** Ponto de entrada: inicia o SQLite, observa o login e escolhe as rotas. */
export default function App() {
    const [usuario, setUsuario] = useState<UsuarioApp | null>(null);
    const [verificandoAuth, setVerificandoAuth] = useState(true);

    useEffect(() => {
        if (usuario) return iniciarSincronizacao();
    }, [usuario?.uid]);

    // 1. Inicializa o banco local SQLite
    useEffect(() => {
        inicializarTabelas()
            .then(() => console.log('SQLite offline pronto!'))
            .catch((erro: unknown) => console.error('Erro no SQLite:', erro));
    }, []);

    // 2. Monitora a sessão do Firebase Authentication
    useEffect(() => {
        const cancelar = observarAuth((u) => {
            setUsuario(u);
            setVerificandoAuth(false);
        });
        return cancelar;
    }, []);

    if (verificandoAuth) {
        return (
            <SafeAreaProvider>
                <View style={estilos.splash}>
                    <ActivityIndicator size="small" color={cores.preto} />
                    <Text style={estilos.splashTexto}>INICIALIZANDO SISTEMA...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />

            {!usuario ? (
                <LoginScreen />
            ) : (
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Home"
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: cores.superficie,
                            },
                            headerTintColor: cores.preto,
                            headerTitleStyle: {
                                fontWeight: '800',
                                fontSize: 12,
                            },
                            headerShadowVisible: false,
                            contentStyle: {
                                backgroundColor: cores.fundo,
                            },
                        }}
                    >
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{ headerShown: false }}
                            initialParams={{ usuarioEmail: usuario.email }}
                        />
                        <Stack.Screen
                            name="Produtos"
                            component={ProdutosScreen}
                            options={{ title: 'INVENTÁRIO DE PRODUTOS' }}
                        />
                        <Stack.Screen
                            name="Fornecedores"
                            component={FornecedoresScreen}
                            options={{ title: 'FORNECEDORES E LOGÍSTICA' }}
                        />
                        <Stack.Screen
                            name="Funcionarios"
                            component={FuncionariosScreen}
                            options={{ title: 'QUADRO DE FUNCIONÁRIOS' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </SafeAreaProvider>
    );
}
