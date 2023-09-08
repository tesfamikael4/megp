FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g npm@latest

COPY . .
EXPOSE 5511
CMD ["npm", "run", "dev"]

#RUN mkdir -p /app
#WORKDIR /app
#COPY . .
#RUN npm install
#RUN npm run build
#EXPOSE 3000
#CMD ["npm", "start"]


