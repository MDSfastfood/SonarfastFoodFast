# Fast-Food-Fast

Sistema de pedidos de comida desenvolvido em Node.js, Express e PostgreSQL.

## Requisitos

- Node.js 20.20.2
- PostgreSQL
- Git

## Instalação

### 1. Clone o projeto

```bash
git clone https://github.com/DaviFernandesDaSilva/cloneFastFoodFast.git
cd cloneFastFoodFast
```

### 2. Instale as dependências

```bash
npm install
```

## Banco de dados

### 3. Crie o banco PostgreSQL

```bash
createdb -U postgres fastfoodfast
```

Digite a senha do usuário `postgres` caso seja solicitada.

### 4. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/fastfoodfast
NODE_ENV=local
PORT=9999
```

Troque `SUA_SENHA` pela senha do seu PostgreSQL.

## Configuração automática

Ao iniciar o projeto, o sistema automaticamente:

- Cria a tabela `users`
- Cria a tabela `orders`
- Cria a tabela `menu`
- Insere os 13 produtos iniciais no menu

Os produtos não serão duplicados caso o servidor seja reiniciado.

Não é necessário editar nenhum arquivo para criar as tabelas ou inserir os produtos.

## Executando

### 5. Inicie o servidor

```bash
npm start
```

O sistema estará disponível em:

```text
http://localhost:9999
```

### Menu

```text
http://localhost:9999/userMenu
```

### API

```text
http://localhost:9999/api/v1
```

## Estrutura principal

```text
Fast-Food-Fast/
├── server/       # Backend / API
├── UI/           # Frontend
├── uploads/      # Imagens enviadas
├── test/         # Testes
├── .env          # Configurações locais
├── package.json
└── README.md
```

## Comandos principais

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm start
```

Executar testes:

```bash
npm test
```

Executar lint:

```bash
npm run lint
```

## Importante

Não coloque o arquivo `.env` real no GitHub.

Cada pessoa deve criar seu próprio `.env` localmente com as informações do seu banco PostgreSQL.