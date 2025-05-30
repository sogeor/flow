
FROM node:18.20.8 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN apt-get update && apt-get install -y python3 python3-dev build-essential
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY ../nginx/ssl/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ../nginx/ssl/privkey.pem /etc/nginx/ssl/privkey.pem

EXPOSE 80 443