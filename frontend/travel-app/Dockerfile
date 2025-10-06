# Dockerfile para frontend Angular
# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm ci

COPY . .

# Compilar aplicación para producción
RUN npm run build

# Etapa 2: Servir con nginx (servidor web liviano)
FROM nginx:alpine

# Copiar aplicación construida desde la etapa anterior
COPY --from=build /app/dist/travel-app/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]