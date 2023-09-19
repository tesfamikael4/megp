FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g npm@latest
COPY . .
RUN npm run build
EXPOSE 5511
CMD ["npm", "run", "dev"]

