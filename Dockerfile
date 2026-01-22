# ETAPA 1: Construcción (Build)
# Usamos una imagen ligera de Node
FROM node:18-alpine as build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché de Docker
COPY package.json package-lock.json ./

# Instalamos las dependencias (usamos 'ci' para instalaciones limpias y más rápidas)
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# Construimos la aplicación (genera la carpeta dist/)
RUN npm run build

# ETAPA 2: Servidor (Production)
# Usamos Nginx Alpine por ser extremadamente ligero
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx (creada en el paso 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos generados en la etapa de construcción
# Nota: Si tu proyecto no es Vite y es CRA, cambia '/app/dist' por '/app/build'
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]