FROM node:20-alpine

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS 
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# El comando por defecto para desarrollo
CMD ["npm", "run", "dev"]