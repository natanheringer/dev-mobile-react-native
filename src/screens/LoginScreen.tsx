import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';
import { loginUsuario, cadastrarUsuario, traduzirErroAuth } from '../services/authService';
import CampoTexto from '../components/CampoTexto';
import AlertaMensagem from '../components/AlertaMensagem';
import BlocoSecao from '../components/BlocoSecao';

/** Tela de autenticação: login ou cadastro. */
export default function LoginScreen() {
    const [isCadastro, setIsCadastro] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);

    /** Valida os campos e faz login ou cadastro. */
    async function handleAuth() {
        setMensagemErro(null);

        if (!email.trim()) {
            setMensagemErro('Informe o e-mail corporativo de acesso.');
            return;
        }
        if (!senha) {
            setMensagemErro('Informe a senha.');
            return;
        }
        if (isCadastro && senha !== confirmarSenha) {
            setMensagemErro('As senhas digitadas não conferem.');
            return;
        }

        setCarregando(true);
        try {
            if (isCadastro) {
                await cadastrarUsuario(email, senha);
            } else {
                await loginUsuario(email, senha);
            }
        } catch (erro) {
            setMensagemErro(traduzirErroAuth(erro));
        } finally {
            setCarregando(false);
        }
    }

    /** Alterna entre Entrar e Criar conta. */
    function escolherModo(cadastro: boolean) {
        setIsCadastro(cadastro);
        setMensagemErro(null);
    }

    return (
        <KeyboardAvoidingView
            style={estilos.tela}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={estilos.loginScroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={estilos.loginPainel}>
                    <View style={estilos.loginMarca}>
                        <Text style={estilos.loginSubtitulo}>CONTROLE DE ESTOQUE E OPERAÇÕES</Text>
                        <Text style={estilos.loginTitulo}>STOCKMASTER</Text>
                        <View style={estilos.loginLinha} />
                    </View>

                    <View style={estilos.cardFormulario}>
                        <View style={estilos.seletorSegmentado}>
                            <TouchableOpacity
                                style={[estilos.segmento, !isCadastro && estilos.segmentoAtivo]}
                                onPress={() => escolherModo(false)}
                            >
                                <Text style={[estilos.segmentoTexto, !isCadastro && estilos.segmentoTextoAtivo]}>
                                    ENTRAR
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[estilos.segmento, isCadastro && estilos.segmentoAtivo]}
                                onPress={() => escolherModo(true)}
                            >
                                <Text style={[estilos.segmentoTexto, isCadastro && estilos.segmentoTextoAtivo]}>
                                    CRIAR CONTA
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <AlertaMensagem tipo="erro" mensagem={mensagemErro} />

                        <BlocoSecao titulo="CREDENCIAIS DE ACESSO">
                            <CampoTexto
                                label="E-MAIL CORPORATIVO *"
                                valor={email}
                                onChange={setEmail}
                                placeholder="usuario@empresa.com.br"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <CampoTexto
                                label="SENHA DE ACESSO *"
                                valor={senha}
                                onChange={setSenha}
                                placeholder="••••••••"
                                secureTextEntry
                                autoCapitalize="none"
                                semDivisor={!isCadastro}
                            />
                            {isCadastro && (
                                <CampoTexto
                                    label="CONFIRMAR SENHA *"
                                    valor={confirmarSenha}
                                    onChange={setConfirmarSenha}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    semDivisor
                                />
                            )}
                        </BlocoSecao>

                        <TouchableOpacity
                            style={estilos.btnConfirmar}
                            onPress={handleAuth}
                            disabled={carregando}
                            activeOpacity={0.85}
                        >
                            {carregando ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={estilos.btnConfirmarTexto}>
                                    {isCadastro ? 'CONCLUIR CADASTRO' : 'ACESSAR SISTEMA'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={estilos.loginRodape}>FIREBASE AUTHENTICATION · CONEXÃO SEGURA SSL</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
