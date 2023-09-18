FROM node:18-alpine 

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install production dependencies
RUN npm install npm@latest --only=production

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which your NestJS application is listening
EXPOSE 3001

# Start the NestJS application
CMD ["pnpm", "run", "start:prod"]
