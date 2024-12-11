FROM node:18-bullseye

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar os arquivos restantes
COPY . . 

# Gere o Prisma Client
RUN npx prisma generate

# Exponha a porta (se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "dev"]
