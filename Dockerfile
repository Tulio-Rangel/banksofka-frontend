# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --configuration=production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

COPY --from=build /app/dist/banksofka-frontend/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]