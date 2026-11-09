---
version: alpha
name: StockMaster
description: Aplicativo acadêmico mobile de estoque, fornecedores e funcionários.
colors:
  primary: '#0D0F12'
  background: '#F4F5F7'
  surface: '#FFFFFF'
  success: '#039855'
  warning: '#DC6803'
  danger: '#D92D20'
typography:
  sans:
    fontFamily: System
  mono:
    fontFamily: monospace
omitted:
  - section: spacing
    reason: Fonte canônica em src/styles/estilosCompartilhados.ts.
  - section: rounded
    reason: Geometria existente mantida nos estilos compartilhados.
components:
  button: {}
  card: {}
  input: {}
---

## Overview

Interface de controle de estoque existente, com cartões claros, divisores e rótulos em maiúsculas. Público: apresentação acadêmica em português brasileiro, uso pelo celular. Esta alteração preserva a identidade visual. A fonte canônica de cores é `src/styles/cores.ts`; este documento registra a intenção e não gera tokens.

## Colors

Superfícies claras e texto escuro. Sucesso, aviso e erro usam os tokens existentes, acompanhados de texto.

## Typography

Fontes nativas do sistema, com estilo mono para dados técnicos. Textos em português brasileiro.

## Layout

Navegação em pilha, listas e formulários com componentes existentes. Respeitar as áreas seguras do dispositivo.

## Elevation & Depth

Manter cartões e divisores dos estilos compartilhados.

## Shapes

Preservar a geometria dos componentes atuais.

## Components

`CampoTexto` e `BotoesFormulario` são os componentes dos formulários; `ListaCadastro` apresenta listas; `AcoesItem` reúne edição e exclusão; `AlertaMensagem` apresenta erros e confirmações; `BarraStatusRede` mostra conexão e pendências. Não criar um segundo sistema visual para a sincronização.

## Do's and Don'ts

- Manter mensagens visíveis depois de fechar o formulário.
- Identificar os cadastros locais por texto, além da cor.
- Não afirmar envio à nuvem antes da confirmação do Firestore.
- Não alterar o visual para implementar a fila offline.
