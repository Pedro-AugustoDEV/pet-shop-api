# Pet Shop API

API REST desenvolvida em Node.js para gerenciamento de pets de um Pet Shop.

## Tecnologias

- Node.js
- Express
- nodemon
- morgan
- body-parser
- CORS
- mysql (driver)
- MariaDB / MySQL

## Estrutura do projeto

```
provatec/
├── config/
│   └── database.js       # Pool de conexões com o banco
├── routes/
│   └── petRoutes.js       # Rotas do CRUD de pets
├── sql/
│   └── create_database.sql # Script de criação do banco e da tabela
├── .env.example            # Modelo das variáveis de ambiente (sem valores reais)
├── .gitattributes
├── .gitignore
├── app.js                 # Configuração do Express
├── server.js               # Ponto de entrada da aplicação
└── package.json
```

## Banco de dados

A tabela principal é `pet`, com os campos:

| Campo   | Tipo         | Observação        |
|---------|--------------|--------------------|
| id      | INT          | auto incremento, chave primária |
| nome    | VARCHAR(100) | obrigatório        |
| especie | VARCHAR(50)  | obrigatório        |
| tutor   | VARCHAR(100) | obrigatório        |

O script `sql/create_database.sql` cria o banco `petshop` e a tabela `pet`, caso ainda não existam.

## Configuração

A conexão com o banco é feita através de variáveis de ambiente, com valores padrão de fallback caso elas não sejam definidas:

| Variável      | Padrão      |
|---------------|-------------|
| DB_HOST       | localhost   |
| DB_USER       | root        |
| DB_PASSWORD   | (vazia)     |
| DB_NAME       | petshop     |

O arquivo `.env.example` documenta essas variáveis (sem valores reais). O projeto não usa um carregador automático de `.env` (como `dotenv`), então, se precisar sobrescrever algum valor — por exemplo, se o seu `root` do MariaDB/MySQL tiver senha —, defina a variável no ambiente antes de iniciar o servidor:

```bash
# Linux/macOS/Git Bash
DB_PASSWORD=sua_senha npm start

# PowerShell
$env:DB_PASSWORD="sua_senha"; npm start
```

Nunca versione sua senha real no código ou em arquivos commitados — use sempre variáveis de ambiente.

## Instalação e execução

```bash
npm install

# produção
npm start

# desenvolvimento (com reinício automático)
npm run dev
```

O servidor sobe por padrão na porta `3000` (configurável via variável de ambiente `PORT`).

## Endpoints

| Método | Rota        | Descrição                    | Status de sucesso |
|--------|-------------|-------------------------------|--------------------|
| GET    | /           | Rota de teste                 | 200 |
| GET    | /pet        | Lista todos os pets           | 200 |
| GET    | /pet/:id    | Busca um pet pelo id          | 200 (404 se não existir) |
| POST   | /pet        | Cria um novo pet               | 201 |
| PUT    | /pet/:id    | Atualiza um pet existente      | 200 (404 se não existir) |
| DELETE | /pet/:id    | Remove um pet                  | 200 (404 se não existir) |

Corpo esperado para POST e PUT:

```json
{
  "nome": "Rex",
  "especie": "Cachorro",
  "tutor": "Ana"
}
```

Erros de validação (campos vazios ou id inválido) retornam status `400`. Erros de banco de dados retornam status `500`.
