import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { funcionariosStyles as styles } from '../styles/funcionariosStyles';
import type { Fornecedor } from '../types/Fornecedor';
import { observarFornecedores, criarFornecedor, atualizarFornecedor, removerFornecedor } from '../services/fornecedorService';

export default function FornecedoresScreen() {
    const [lista, setLista] = useState<Fornecedor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [editando, setEditando] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [aviso, setAviso] = useState('');

    useEffect(() => observarFornecedores((itens) => { setLista(itens); setCarregando(false); }, (erro) => { setAviso(erro.message); setCarregando(false); }), []);

    function limpar() { setEditando(null); setNome(''); setTelefone(''); setEmail(''); }

    async function salvar() {
        setAviso('');
        try {
            const dados = { nome, telefone, email };
            if (editando) await atualizarFornecedor(editando, dados); else await criarFornecedor(dados);
            limpar();
        } catch (erro) { setAviso(erro instanceof Error ? erro.message : String(erro)); }
    }

    function editar(item: Fornecedor) { setEditando(item.id ?? null); setNome(item.nome); setTelefone(item.telefone); setEmail(item.email); }

    async function excluir(id?: string) {
        if (!id) return;
        try { await removerFornecedor(id); if (editando === id) limpar(); }
        catch (erro) { setAviso(erro instanceof Error ? erro.message : String(erro)); }
    }

    return <View style={styles.container}>
        <TextInput style={styles.campo} placeholder="Nome do fornecedor" value={nome} onChangeText={setNome} />
        <TextInput style={styles.campo} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <TextInput style={styles.campo} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <View style={styles.botoes}><Button title={editando ? 'Salvar alterações' : 'Cadastrar'} onPress={salvar} />{editando && <Button title="Cancelar" onPress={limpar} />}</View>
        {!!aviso && <Text style={styles.aviso}>{aviso}</Text>}
        {carregando ? <ActivityIndicator style={styles.espera} /> : <FlatList data={lista} keyExtractor={(item) => item.id ?? item.nome} ListEmptyComponent={<Text style={styles.vazio}>Nenhum fornecedor cadastrado.</Text>} renderItem={({ item }) => <View style={styles.item}><View style={styles.itemTexto}><Text style={styles.itemNome}>{item.nome}</Text><Text style={styles.itemDetalhe}>{item.telefone} · {item.email}</Text><View style={styles.botoes}><Button title="Editar" onPress={() => editar(item)} /><Button title="Excluir" onPress={() => excluir(item.id)} /></View></View></View>} />}
    </View>;
}
