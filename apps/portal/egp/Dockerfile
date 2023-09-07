FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g npm@latest
COPY . .

CMD ["npm", "run", "dev"]
