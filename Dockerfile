# Use a imagem oficial do Node.js como base
FROM node:14

# Configure o diretório de trabalho na imagem
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json .

# Instale as dependências
RUN npm install

# Copie os arquivos do código fonte para o diretório de trabalho
COPY . .

# Expõe a porta 3000 para o tráfego externo
EXPOSE 3000

# Comando para iniciar a aplicação React
CMD ["npm", "start"]
