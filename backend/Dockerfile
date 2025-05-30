# Используем Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Компилируем TypeScript в production
RUN npm run build

# Открываем порт
EXPOSE 3000

# Команда по умолчанию (переопределяется в docker-compose для dev)
CMD ["npm", "start"]