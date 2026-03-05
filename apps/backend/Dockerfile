# Dockerfile for NestJS Backend in a Production Environment

# Use the official Node.js image as a base image
FROM node:16 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Remove development dependencies and dev files
RUN npm prune --production

# Start the application
CMD ["node", "dist/main.js"]

# Expose the port the app runs on
EXPOSE 3000