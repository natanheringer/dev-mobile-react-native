import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { funcionariosStyles as styles } from '../styles/funcionariosStyles';
import type { Produto } from '../types/Produto';
import { observarProdutos, criarProduto, atualizarProduto, removerProduto } from '../services/produtoService';

export default function ProdutosScreen() {
    const [lista, setLista] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [editando, setEditando] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [aviso, setAviso] = useState('');

    useEffect(() => observarProdutos((itens) => { setLista(itens); setCarregando(false); }, (erro) => { setAviso(erro.message); setCarregando(false); }), []);

    function limpar() { setEditando(null); setNome(''); setCodigo(''); setQuantidade(''); setPreco(''); }

    async function salvar() {
        setAviso('');
        try {
            const dados = { nome, codigo, quantidade: Number(quantidade), preco: Number(preco) };
            if (!quantidade.trim() || !preco.trim() || Number.isNaN(dados.quantidade) || Number.isNaN(dados.preco)) throw new Error('Informe quantidade e preço válidos.');
            if (editando) await atualizarProduto(editando, dados); else await criarProduto(dados);
            limpar();
        } catch (erro) { setAviso(erro instanceof Error ? erro.message : String(erro)); }
    }

    function editar(item: Produto) { setEditando(item.id ?? null); setNome(item.nome); setCodigo(item.codigo); setQuantidade(String(item.quantidade)); setPreco(String(item.preco)); }

    async function excluir(id?: string) {
        if (!id) return;
        try { await removerProduto(id); if (editando === id) limpar(); }
        catch (erro) { setAviso(erro instanceof Error ? erro.message : String(erro)); }
    }

    return <View style={styles.container}>
        <TextInput style={styles.campo} placeholder="Nome do produto" value={nome} onChangeText={setNome} />
        <TextInput style={styles.campo} placeholder="Código do produto" value={codigo} onChangeText={setCodigo} />
        <TextInput style={styles.campo} placeholder="Quantidade em estoque" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
        <TextInput style={styles.campo} placeholder="Preço (ex.: 19.90)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
        <View style={styles.botoes}><Button title={editando ? 'Salvar alterações' : 'Cadastrar'} onPress={salvar} />{editando && <Button title="Cancelar" onPress={limpar} />}</View>
        {!!aviso && <Text style={styles.aviso}>{aviso}</Text>}
        {carregando ? <ActivityIndicator style={styles.espera} /> : <FlatList data={lista} keyExtractor={(item) => item.id ?? item.codigo} ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto cadastrado.</Text>} renderItem={({ item }) => <View style={styles.item}><View style={styles.itemTexto}><Text style={styles.itemNome}>{item.nome}</Text><Text style={styles.itemDetalhe}>Código: {item.codigo} · Estoque: {item.quantidade} · R$ {item.preco.toFixed(2)}</Text><View style={styles.botoes}><Button title="Editar" onPress={() => editar(item)} /><Button title="Excluir" onPress={() => excluir(item.id)} /></View></View></View>} />}
    </View>;
}
