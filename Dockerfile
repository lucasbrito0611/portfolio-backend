# ---------- Estágio 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os manifests primeiro (aproveitamento de cache do Docker)
COPY package*.json ./

RUN npm ci

# Copia o restante do código e compila o TypeScript
COPY . .

RUN npm run build

# ---------- Estágio 2: Produção ----------
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm ci --only=production

# Copia só o código compilado do estágio anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
