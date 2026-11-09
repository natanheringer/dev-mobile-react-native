# Contrato de interação

Fonte de requisitos: enunciado acadêmico fornecido pelo usuário; implementação simples solicitada em 09/11/2026.

| Capacidade | Responsável canônico | Comportamento |
|---|---|---|
| Form | CampoTexto / BotoesFormulario | Validar antes de salvar; manter valores em caso de erro. |
| Toast | AlertaMensagem | Feedback em português, erros visíveis e anúncio acessível. |
| CRUD | Telas e serviços de cada módulo | Cadastro e edição retornam à lista; ações usam os componentes compartilhados. |
| Sincronização | sincronizacaoService.ts | Um envio por vez; mesmo ID local e remoto; remover individualmente após confirmação. |
| Pendências locais | sqlite.ts | Novos funcionários persistidos antes do envio; listagem e contadores atualizados após cada mudança. |

## Fluxo offline de funcionários

Cadastro → validação → SQLite → registro local visível → retorno da conexão → Firestore → remoção da pendência.
O evento de conexão e o retorno ao aplicativo disparam tentativas enquanto houver sessão autenticada. Um botão permite nova tentativa. Em falha, preservar o cadastro local e mostrar o erro.

Edição e exclusão de registros da nuvem exigem conexão. Pendentes aguardam o envio para liberar essas ações. O escopo offline é o cadastro de funcionários; não há promessa de cache completo dos três módulos ou execução com o app fechado.

## Verificação

Executar `npm run typecheck`, verificar o bundle Android e seguir `APRESENTACAO.md` em um celular com Firebase configurado.
