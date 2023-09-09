FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g npm@latest
COPY . .
EXPOSE 5500
CMD ["npm", "run", "dev"]
