# Selecciona la imagen base de Node.js
FROM node:14 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Usa una imagen de nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos compilados de la fase de construcción anterior
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto en el que Nginx se ejecuta
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
