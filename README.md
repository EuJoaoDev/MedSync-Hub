# Medsync Hub

##  Introdução
A **Multinacional Guarda-Chuva Farmácias** está avançando para a próxima etapa do desenvolvimento do seu sistema interno de logística. O **Medsync Hub** é um backend **RESTful API** projetado para otimizar a gestão de usuários, produtos e movimentações entre as filiais da organização.

Com um sistema robusto e escalável, essa solução facilitará o gerenciamento das operações logísticas, garantindo maior eficiência e rastreabilidade no transporte de medicamentos.

## 🚀 Tecnologias Utilizadas
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework para construção da API
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para modelagem e manipulação do banco
- **JWT (JSON Web Token)** - Autenticação segura
- **Bcrypt** - Hash de senhas para maior segurança
- **Dotenv** - Gerenciamento de variáveis de ambiente

##  Funcionalidades
###  Gerenciamento de Usuários
✅ Cadastro de usuários (ADMIN, FILIAL e MOTORISTA)
✅ Login e autenticação com JWT
✅ Listagem de usuários com filtros por perfil
✅ Atualização de dados e status de usuários

###  Gerenciamento de Produtos
✅ Cadastro de produtos por filiais
✅ Listagem de produtos disponíveis

###  Movimentação de Produtos
✅ Solicitação de transferência entre filiais
✅ Atualização do status da movimentação (Pendente, Em Andamento, Concluído)
✅ Controle de estoque e rastreabilidade

##  Estrutura do Banco de Dados
O sistema conta com as seguintes tabelas principais:
- **users**: Armazena informações dos usuários e seus perfis
- **branches**: Registra as filiais e suas informações
- **drivers**: Registra os motoristas cadastrados
- **products**: Gerencia os produtos disponíveis em cada filial
- **movements**: Controla as movimentações de produtos entre filiais

## 🔑 Autenticação e Controle de Acesso
Todas as requisições protegidas utilizam **JWT** para autenticação. Além disso, há middleware para controle de permissões:
- **ADMIN** pode gerenciar usuários
- **FILIAL** pode cadastrar produtos e solicitar movimentações
- **MOTORISTA** pode aceitar entregas e finalizar movimentações

## 🏗️ Como Executar o Projeto
###  Pré-requisitos
- **Node.js** instalado
- **PostgreSQL** configurado

###  Instalação
```bash
# Clone o repositório
git clone https://github.com/EuJoaoDev/MedSync-Hub

# Acesse o diretório do projeto
cd medsync-hub

# Instale as dependências
npm install
```

###  Configuração do Banco de Dados
1. Configure as variáveis de ambiente no arquivo **.env**:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=medsync_hub
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
```
2. Execute as migrations para criar as tabelas:
```bash
npx sequelize db:migrate
```

###  Executando o Servidor
```bash
npm start
```
A API estará disponível em **http://localhost:3000**.

## 🔄 Endpoints da API
###  Usuários
- **POST /users** → Cadastro de usuário *(ADMIN apenas)*
- **POST /login** → Autenticação
- **GET /users** → Listagem de usuários *(ADMIN apenas)*
- **GET /users/:id** → Detalhes de um usuário *(ADMIN ou o próprio motorista)*
- **PUT /users/:id** → Atualização de usuário *(ADMIN ou o próprio motorista)*
- **PATCH /users/:id/status** → Atualização de status *(ADMIN apenas)*

###  Produtos
- **POST /products** → Cadastro de produtos *(FILIAL apenas)*
- **GET /products** → Listagem de produtos *(FILIAL apenas)*

###  Movimentações
- **POST /movements/** → Cadastro de movimentação *(FILIAL apenas)*
- **GET /movements** → Listagem de movimentações *(FILIAL e MOTORISTA)*
- **PATCH /movements/:id/start** → Iniciar movimentação *(MOTORISTA apenas)*
- **PATCH /movements/:id/end** → Finalizar movimentação *(MOTORISTA que iniciou)*

## 📈 Melhorias Futuras
 Implementação de logs para auditoria
 Integração com serviços externos de rastreamento
 Interface gráfica para facilitar a gestão



---
📩 **Dúvidas ou sugestões?** Entre em contato! 💬


Quadro Trello - https://trello.com/b/tFd7P9UY/projeto-modulo-2
Link vídeo - https://drive.google.com/file/d/11OQfnbrcG0MNl_btS_bRevZ7Pp5Ug-QZ/view?usp=sharing
