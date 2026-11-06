/***

    Tela de funcionarios: lista, cadastra, edita e remove.
    Toda a conversa com o banco passa por src/services/funcionarioService.

*/

import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Pressable,
    ActivityIndicator,
} from 'react-native';

import { funcionariosStyles as styles } from '../styles/funcionariosStyles';
import type { Funcionario } from '../types/Funcionario';
import {
    observarFuncionarios,
    criarFuncionario,
    atualizarFuncionario,
    removerFuncionario,
} from '../services/funcionarioService';

export default function FuncionariosScreen() {
    const [lista, setLista]         = useState<Funcionario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando]   = useState(false);
    const [aviso, setAviso]         = useState<string | null>(null);

    // Id em edicao; vazio significa que o formulario esta cadastrando.
    const [editando, setEditando] = useState<string | null>(null);
    const [nome, setNome]   = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');

    // Escuta a colecao em tempo real e cancela ao sair da tela.
    useEffect(() => {
        const cancelar = observarFuncionarios(
            (funcionarios) => {
                setLista(funcionarios);
                setCarregando(false);
            },
            (erro) => {
                setAviso(erro.message);
                setCarregando(false);
            }
        );
        return cancelar;
    }, []);

    const limparFormulario = useCallback(() => {
        setEditando(null);
        setNome('');
        setEmail('');
        setCargo('');
    }, []);

    async function salvar() {
        setAviso(null);
        setSalvando(true);
        try {
            if (editando) {
                await atualizarFuncionario(editando, { nome, email, cargo });
            } else {
                await criarFuncionario({ nome, email, cargo });
            }
            limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        } finally {
            setSalvando(false);
        }
    }

    async function remover(id?: string) {
        if (!id) return;
        setAviso(null);
        try {
            await removerFuncionario(id);
            if (editando === id) limparFormulario();
        } catch (erro) {
            setAviso(erro instanceof Error ? erro.message : String(erro));
        }
    }

    function editar(funcionario: Funcionario) {
        setEditando(funcionario.id ?? null);
        setNome(funcionario.nome);
        setEmail(funcionario.email);
        setCargo(funcionario.cargo ?? '');
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.campo}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.campo}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.campo}
                placeholder="Cargo (opcional)"
                value={cargo}
                onChangeText={setCargo}
            />

            <View style={styles.botoes}>
                <Button
                    title={editando ? 'Salvar alterações' : 'Cadastrar'}
                    onPress={salvar}
                    disabled={salvando}
                />
                {editando && <Button title="Cancelar" onPress={limparFormulario} />}
            </View>

            {aviso && <Text style={styles.aviso}>{aviso}</Text>}

            {carregando ? (
                <ActivityIndicator style={styles.espera} />
            ) : (
                <FlatList
                    data={lista}
                    keyExtractor={(item) => item.id ?? item.email}
                    ListEmptyComponent={
                        <Text style={styles.vazio}>Nenhum funcionário cadastrado.</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Pressable style={styles.itemTexto} onPress={() => editar(item)}>
                                <Text style={styles.itemNome}>{item.nome}</Text>
                                <Text style={styles.itemDetalhe}>
                                    {item.email}
                                    {item.cargo ? ` · ${item.cargo}` : ''}
                                </Text>
                                {item.pendente && (
                                    <Text style={styles.itemPendente}>salvando…</Text>
                                )}
                            </Pressable>
                            <Button title="Excluir" onPress={() => remover(item.id)} />
                        </View>
                    )}
                />
            )}
        </View>
    );
}
