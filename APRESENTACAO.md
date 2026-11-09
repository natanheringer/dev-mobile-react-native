# Roteiro de apresentação

## Preparação

1. Copie `.env.example` para `.env` e preencha os dados do seu projeto Firebase.
2. No console Firebase, habilite Authentication > E-mail/senha e crie o Firestore Database.
3. Confira se as regras do Firestore permitem os CRUDs para o usuário autenticado.
4. Execute `npm install` e `npx expo start --clear`. Abra no celular pelo Expo Go.
5. Entre com internet antes de demonstrar o modo avião. Mantenha o aplicativo aberto.

## O que mostrar

1. Crie uma conta ou entre no app. Mostre o usuário no Firebase Authentication.
2. Em Produtos, Fornecedores e Funcionários, cadastre, liste, edite e exclua um registro.
3. Em Fornecedores, consulte o CEP `01001000`: a API ViaCEP recebe o CEP e retorna rua, bairro, cidade e UF para preencher o endereço.
4. Abra Funcionários e desligue o Wi-Fi e os dados móveis, ou ative o modo avião.
5. Cadastre um funcionário com um e-mail novo. Ele aparecerá como **LOCAL (SQLITE)** e no contador de pendentes.
6. Volte à tela inicial e retorne a Funcionários: o registro continua guardado no SQLite.
7. Reative a internet. O envio ocorre automaticamente, inclusive se estiver na tela inicial. Aguarde o contador zerar e o registro aparecer como **FIRESTORE CLOUD**.
8. Mostre o documento na coleção `funcionarios` do console Firestore.

## Explicação simples da sincronização

“Todo novo funcionário é salvo primeiro no SQLite do celular. Com internet, o aplicativo envia esse cadastro ao Firestore. Sem internet, ele permanece na fila local. Quando a conexão volta, o envio é automático. O aplicativo só remove a pendência depois da confirmação do Firestore e usa o mesmo ID para não duplicar o documento se precisar tentar novamente.”

## Escopo offline

- O SQLite guarda **novos cadastros de funcionários** pendentes de envio.
- A edição e a exclusão de registros da nuvem precisam de internet.
- Cadastros pendentes liberam edição e exclusão após o envio.
- Produtos, fornecedores e a consulta ViaCEP são demonstrados com internet.
- A sincronização acontece enquanto o aplicativo está aberto ou ao voltar para ele; não é um serviço executado com o app fechado.
- O botão de sincronização continua disponível para tentar novamente após um erro.
- Sem configuração do Firebase, os outros módulos mantêm o modo de demonstração em memória; a fila SQLite não é apagada nem considerada enviada nesse modo.
