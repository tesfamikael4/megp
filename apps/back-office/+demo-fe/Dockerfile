FROM node:18-alpine
# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .
EXPOSE 5599
# Start the application
CMD [ "pnpm", "run","dev" ]


