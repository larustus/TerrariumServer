# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port your WebSocket server runs on
EXPOSE 8082

# Start the WebSocket server
CMD ["node", "server.mjs"]
