# Usar uma imagem do Node.js como base
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências e instalar
COPY package.json yarn.lock ./
RUN yarn install

# Copiar o restante do código
COPY . .

# Expor a porta do backend
EXPOSE 5000

# Rodar o backend
CMD ["yarn", "dev"]
