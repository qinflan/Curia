# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source
COPY . .

# Expose app port
EXPOSE 3000

# Default command
CMD ["npm", "start"]