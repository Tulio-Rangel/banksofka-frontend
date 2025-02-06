# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG BANK_API_URL
ARG REACTIVE_API_URL

RUN echo "export const environment = { production: true, apiUrl: '${BANK_API_URL}', reactiveApiUrl: '${REACTIVE_API_URL}' };" > src/environments/environment.ts

RUN npm run build --configuration=production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

COPY --from=build /app/dist/banksofka-frontend/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]