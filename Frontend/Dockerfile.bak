# Stage 1: Build
FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install 

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]