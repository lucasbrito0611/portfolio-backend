# 🚀 Portfolio — Backend

API REST do meu portfólio pessoal, desenvolvida em **NestJS** como projeto de aprendizado do framework. Gerencia projetos, skills e autenticação administrativa.

## ✨ Destaques

- CRUD completo de **Projetos** e **Skills**, consumido dinamicamente pelo frontend
- Autenticação JWT via cookies HttpOnly com guard protegendo todas as rotas de escrita
- Proteção contra brute force com Rate Limiting (`@nestjs/throttler`)
- Documentação interativa automática via **Swagger/OpenAPI** em `/api`
- Health check em `GET /` com verificação de conexão ao banco (via `@nestjs/terminus`)
- Validação de entrada com `class-validator` + `ValidationPipe` global
- Suporte a banco local (Docker) e banco em nuvem (Neon) via `DATABASE_URL`
- Migrations TypeORM para evoluir o schema com segurança

## 🧭 Visão Geral

- **Framework:** NestJS 11
- **Linguagem:** TypeScript
- **ORM:** TypeORM + PostgreSQL
- **Autenticação:** JWT via Cookies HttpOnly (Passport + `@nestjs/jwt` + `cookie-parser`)
- **Rate Limiting:** `@nestjs/throttler`
- **Testes:** Unitários (Jest) e E2E (Supertest)
- **Documentação:** Swagger (`@nestjs/swagger`)
- **Health Check:** `@nestjs/terminus`
- **Configuração:** `@nestjs/config` (variáveis de ambiente centralizadas)
- **Deploy:** Render (auto-deploy na branch `main`)
- **Banco em produção:** Neon (PostgreSQL serverless)

## 📂 Estrutura do Projeto

```
portfolio-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts      # POST /api/v1/auth/login
│   │   ├── auth.service.ts         # Lógica de validação e geração de JWT
│   │   ├── auth.module.ts
│   │   ├── jwt-auth.guard.ts       # Guard que protege rotas privadas
│   │   ├── jwt.strategy.ts         # Estratégia Passport para JWT
│   │   └── dto/                    # LoginDto com validação
│   ├── projects/
│   │   ├── projects.controller.ts  # CRUD de projetos
│   │   ├── projects.service.ts
│   │   ├── projects.module.ts
│   │   ├── entities/               # Entidade Project (TypeORM)
│   │   └── dto/                    # CreateProjectDto, UpdateProjectDto
│   ├── skills/
│   │   ├── skills.controller.ts    # CRUD de skills
│   │   ├── skills.service.ts
│   │   ├── skills.module.ts
│   │   ├── entities/               # Entidade Skill (TypeORM)
│   │   └── dto/                    # CreateSkillDto, UpdateSkillDto
│   ├── app.controller.ts           # GET / (health check)
│   ├── app.module.ts               # Módulo raiz com TypeORM e ConfigModule
│   ├── data-source.ts              # DataSource para CLI de migrations
│   └── main.ts                     # Bootstrap com CORS, Pipes e Swagger
├── .env.example
└── package.json
```

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js 20+, Docker (para o banco local)

```bash
# 1. Suba o banco de dados PostgreSQL via Docker
docker compose up -d

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Inicie em modo desenvolvimento (hot-reload)
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.
A documentação Swagger estará em `http://localhost:3000/api`.

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL (ex: Neon). Tem prioridade sobre as variáveis individuais abaixo |
| `DB_HOST` | Host do banco local (padrão: `localhost`) |
| `DB_PORT` | Porta do banco (padrão: `5432`) |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_DATABASE` | Nome do banco |
| `FRONTEND_URL` | URL do frontend para configuração do CORS |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT (use 32+ caracteres) |
| `ADMIN_EMAIL` | E-mail do usuário administrador |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt da senha do administrador |

## 🗄️ Migrations

O projeto usa migrations TypeORM para controle do schema do banco. Com `synchronize: false` em produção, todas as mudanças de schema devem ser feitas via migration.

```bash
# Gerar uma nova migration a partir das mudanças nas entidades
npm run migration:generate src/migrations/NomeDaMigration

# Aplicar as migrations pendentes
npm run migration:run

# Reverter a última migration aplicada
npm run migration:revert
```

## 📖 Endpoints Principais

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/` | Pública | Health check (banco + app) |
| `GET` | `/api` | Pública | Documentação Swagger |
| `POST` | `/api/v1/auth/login` | Pública | Login — define cookie `admin_token` (HttpOnly) |
| `POST` | `/api/v1/auth/logout` | JWT | Logout — limpa cookie `admin_token` |
| `GET` | `/api/v1/projects` | Pública | Lista todos os projetos |
| `POST` | `/api/v1/projects` | JWT | Cria projeto |
| `PUT` | `/api/v1/projects/:id` | JWT | Atualiza projeto |
| `DELETE` | `/api/v1/projects/:id` | JWT | Remove projeto |
| `GET` | `/api/v1/skills` | Pública | Lista todas as skills |
| `POST` | `/api/v1/skills` | JWT | Cria skill |
| `PUT` | `/api/v1/skills/:id` | JWT | Atualiza skill |
| `DELETE` | `/api/v1/skills/:id` | JWT | Remove skill |

## ☁️ Deploy (Render)

O projeto está configurado para deploy automático no Render a partir da branch `main`.

| Campo | Valor |
|---|---|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |

Configure as variáveis de ambiente no painel do Render (Environment → Environment Variables). Qualquer alteração em env vars aciona um novo deploy automaticamente.

> **Keep-alive:** Configure o [UptimeRobot](https://uptimerobot.com) para pingar `GET /` a cada 5 minutos e evitar o sleep do free tier do Render.

## 🔗 Frontend

Este backend é consumido pelo [portfolio-frontend](https://github.com/lucasbrito0611/portfolio-frontend), hospedado no Vercel.
