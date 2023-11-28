# Étape 1: Construire l'application React
FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2: Configurer et démarrer Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
RUN echo "server { listen 5000; root /usr/share/nginx/html; index index.html; }" > /etc/nginx/conf.d/default.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
