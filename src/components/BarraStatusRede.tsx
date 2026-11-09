import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { estilos } from '../styles/estilosCompartilhados';
import { cores } from '../styles/cores';

interface Props {
    isOnline: boolean;
    totalPendentes: number;
    sincronizando: boolean;
    onSincronizar: () => void;
}

/** Mostra online/offline e o botão de sincronizar pendentes. */
export default function BarraStatusRede({
    isOnline,
    totalPendentes,
    sincronizando,
    onSincronizar,
}: Props) {
    return (
        <View style={estilos.barraStatusRede}>
            <View style={estilos.statusLinha}>
                <View
                    style={[
                        estilos.pontoStatus,
                        { backgroundColor: isOnline ? cores.sucesso : cores.aviso },
                    ]}
                />
                <Text style={estilos.statusTexto}>
                    {isOnline ? 'CANAL ATIVO: FIRESTORE REST' : 'OFFLINE: MODO SQLITE EMBUTIDO'}
                </Text>
            </View>

            {totalPendentes > 0 ? (
                <TouchableOpacity
                    style={estilos.btnSync}
                    onPress={onSincronizar}
                    disabled={sincronizando}
                    activeOpacity={0.8}
                >
                    {sincronizando ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={estilos.btnSyncTexto}>
                            SINCRONIZAR ({totalPendentes})
                        </Text>
                    )}
                </TouchableOpacity>
            ) : (
                <Text style={estilos.syncStatusTexto}>SQLITE SINCRONIZADO</Text>
            )}
        </View>
    );
}
